import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  markdownConfigDefaults
} from "@astrojs/internal-helpers/markdown";
import { isSatteriProcessor, satteri } from "@astrojs/markdown-satteri";
import { getContainerRenderer as getContainerRendererImpl } from "./container-renderer.js";
import { isUnifiedProcessor } from "./processor-guards.js";
import { safeParseFrontmatter } from "./utils.js";
import { vitePluginMdx } from "./vite-plugin-mdx.js";
import { vitePluginMdxPostprocess } from "./vite-plugin-mdx-postprocess.js";
function getContainerRenderer() {
  console.warn(
    "[@astrojs/mdx] Importing `getContainerRenderer` from `@astrojs/mdx` is deprecated. Import it from `@astrojs/mdx/container-renderer` instead."
  );
  return getContainerRendererImpl();
}
function mdx(partialMdxOptions = {}) {
  let vitePluginMdxOptions = {};
  return {
    name: "@astrojs/mdx",
    hooks: {
      "astro:config:setup": async (params) => {
        const { updateConfig, config, addPageExtension, addContentEntryType, addRenderer } = params;
        addRenderer({
          name: "astro:jsx",
          serverEntrypoint: new URL("../dist/server.js", import.meta.url)
        });
        addPageExtension(".mdx");
        addContentEntryType({
          extensions: [".mdx"],
          async getEntryInfo({ fileUrl, contents }) {
            const parsed = safeParseFrontmatter(contents, fileURLToPath(fileUrl));
            return {
              data: parsed.frontmatter,
              body: parsed.content.trim(),
              slug: parsed.frontmatter.slug,
              rawData: parsed.rawFrontmatter
            };
          },
          contentModuleTypes: await fs.readFile(
            new URL("../template/content-module-types.d.ts", import.meta.url),
            "utf-8"
          ),
          // MDX can import scripts and styles,
          // so wrap all MDX files with script / style propagation checks
          handlePropagation: true
        });
        updateConfig({
          vite: {
            plugins: [vitePluginMdx(vitePluginMdxOptions), vitePluginMdxPostprocess(config)]
          }
        });
      },
      "astro:config:done": async ({ config, logger }) => {
        warnDeprecatedMdxPluginOptions(partialMdxOptions, logger);
        const extendMarkdownConfig = partialMdxOptions.extendMarkdownConfig ?? defaultMdxOptions.extendMarkdownConfig;
        const markdownConfig = extendMarkdownConfig ? config.markdown : markdownConfigDefaults;
        const resolvedMdxOptions = applyDefaultOptions({
          options: partialMdxOptions,
          defaults: { ...markdownConfig, optimize: false }
        });
        const configuredProcessor = partialMdxOptions.processor ?? (extendMarkdownConfig ? config.markdown.processor : void 0);
        let processor = configuredProcessor ?? satteri();
        if (hasLegacyMdxPluginOptions(partialMdxOptions)) {
          const base = isUnifiedProcessor(processor) ? processor.options : void 0;
          const mayUseUnified = base !== void 0 || configuredProcessor === void 0;
          const unified = mayUseUnified ? await importUnified() : void 0;
          if (unified) {
            processor = unified({
              // MDX plugin lists are function-only; widen to the processor's plugin type.
              remarkPlugins: partialMdxOptions.remarkPlugins ?? base?.remarkPlugins,
              rehypePlugins: partialMdxOptions.rehypePlugins ?? base?.rehypePlugins,
              remarkRehype: partialMdxOptions.remarkRehype ?? base?.remarkRehype,
              recmaPlugins: partialMdxOptions.recmaPlugins ?? base?.recmaPlugins,
              gfm: base?.gfm,
              smartypants: base?.smartypants
            });
          } else {
            warnLegacyMdxPluginOptionsIgnored(partialMdxOptions, processor, {
              userConfigured: configuredProcessor !== void 0,
              logger
            });
          }
        }
        const processorFeatures = readProcessorFeatures(processor);
        if (partialMdxOptions.gfm === void 0 && processorFeatures.gfm !== void 0) {
          resolvedMdxOptions.gfm = processorFeatures.gfm;
        }
        if (partialMdxOptions.smartypants === void 0 && processorFeatures.smartypants !== void 0) {
          resolvedMdxOptions.smartypants = processorFeatures.smartypants;
        }
        Object.assign(vitePluginMdxOptions, {
          mdxOptions: resolvedMdxOptions,
          srcDir: config.srcDir,
          processor
        });
        vitePluginMdxOptions = {};
      }
    }
  };
}
const defaultMdxOptions = {
  extendMarkdownConfig: true
};
const LEGACY_PLUGIN_OPTIONS = [
  "remarkPlugins",
  "rehypePlugins",
  "remarkRehype",
  "recmaPlugins"
];
function hasLegacyMdxPluginOptions(options) {
  return LEGACY_PLUGIN_OPTIONS.some((key) => options[key] !== void 0);
}
async function importUnified() {
  try {
    return (await import("@astrojs/markdown-remark")).unified;
  } catch {
    return void 0;
  }
}
function warnLegacyMdxPluginOptionsIgnored(options, processor, { userConfigured, logger }) {
  const ignored = LEGACY_PLUGIN_OPTIONS.filter((key) => options[key] !== void 0);
  const names = ignored.map((key) => `\`${key}\``).join(", ");
  const isPlural = ignored.length > 1;
  const whose = userConfigured ? `your \`${processor.name}\` processor` : `the default \`${processor.name}\` processor used for \`.mdx\``;
  logger.warn(
    `${names} on \`mdx({...})\` ${isPlural ? "are" : "is"} ignored because ${whose} does not run remark/rehype plugins. Set \`markdown.processor: unified({...})\` from \`@astrojs/markdown-remark\` to apply them.`
  );
}
function readProcessorFeatures(processor) {
  if (isUnifiedProcessor(processor)) {
    return { gfm: processor.options.gfm, smartypants: processor.options.smartypants };
  }
  if (isSatteriProcessor(processor)) {
    const { gfm, smartPunctuation } = processor.options.features;
    return {
      gfm: typeof gfm === "boolean" ? gfm : void 0,
      smartypants: typeof smartPunctuation === "boolean" ? smartPunctuation : void 0
    };
  }
  return {};
}
let didWarnAboutDeprecatedMdxPluginOptions = false;
function warnDeprecatedMdxPluginOptions(options, logger) {
  if (didWarnAboutDeprecatedMdxPluginOptions) return;
  const deprecated = LEGACY_PLUGIN_OPTIONS.filter((key) => options[key] !== void 0);
  if (deprecated.length === 0) return;
  didWarnAboutDeprecatedMdxPluginOptions = true;
  const names = deprecated.map((key) => `\`${key}\``).join(", ");
  const isPlural = deprecated.length > 1;
  logger.warn(
    `${names} on \`mdx({...})\` ${isPlural ? "are" : "is"} deprecated. Pass ${isPlural ? "them" : "it"} to \`unified({...})\` from \`@astrojs/markdown-remark\` and set it as \`markdown.processor\` instead \u2014 MDX will inherit ${isPlural ? "them" : "it"}. Will be removed in a future major.`
  );
}
function applyDefaultOptions({
  options,
  defaults
}) {
  return {
    syntaxHighlight: options.syntaxHighlight ?? defaults.syntaxHighlight,
    shikiConfig: options.shikiConfig ?? defaults.shikiConfig,
    gfm: options.gfm ?? defaults.gfm,
    smartypants: options.smartypants ?? defaults.smartypants,
    optimize: options.optimize ?? defaults.optimize
  };
}
export {
  mdx as default,
  getContainerRenderer
};
