import { safeParseFrontmatter } from "./utils.js";
function vitePluginMdx(opts) {
  let mdxRenderer;
  let sourcemapEnabled;
  return {
    name: "@mdx-js/rolldown",
    enforce: "pre",
    buildEnd() {
      mdxRenderer = void 0;
    },
    configResolved(resolved) {
      sourcemapEnabled = !!resolved.build.sourcemap;
      const jsxPluginIndex = resolved.plugins.findIndex((p) => p.name === "astro:jsx");
      if (jsxPluginIndex !== -1) {
        resolved.plugins.splice(jsxPluginIndex, 1);
      }
    },
    resolveId: {
      filter: {
        // Do not match sources that start with /
        id: /^[^/]/
      },
      async handler(source, importer, options) {
        if (importer?.endsWith(".mdx")) {
          let resolved = await this.resolve(source, importer, options);
          if (!resolved) resolved = await this.resolve("./" + source, importer, options);
          return resolved;
        }
      }
    },
    transform: {
      filter: {
        id: /\.mdx$/
      },
      async handler(code, id) {
        const { frontmatter, content } = safeParseFrontmatter(code, id);
        try {
          if (!mdxRenderer) {
            mdxRenderer = await resolveMdxRenderer(opts, sourcemapEnabled);
          }
          const result = await mdxRenderer.process(content, id, frontmatter);
          return {
            code: result.code,
            map: result.map ?? null,
            meta: {
              astro: result.astroMetadata,
              // `lang: 'ts'` makes Vite resolve `.js` import specifiers to `.ts` files.
              vite: { lang: "ts" }
            }
          };
        } catch (e) {
          const err = e;
          err.name = "MDXError";
          let line = e.line;
          let column = e.column;
          if (line == null || column == null) {
            const match = /^(\d+):(\d+):/.exec(e.message);
            if (match) {
              line ??= Number(match[1]);
              column ??= Number(match[2]);
            }
          }
          err.loc = { file: id, line, column };
          Error.captureStackTrace(err);
          throw err;
        }
      }
    }
  };
}
const BUILT_IN_PROCESSOR_PACKAGES = {
  satteri: "@astrojs/markdown-satteri",
  unified: "@astrojs/markdown-remark"
};
function mdxUnsupportedMessage(name) {
  const pkg = BUILT_IN_PROCESSOR_PACKAGES[name];
  if (pkg) {
    return `\`${pkg}\` is too old to render \`.mdx\` files. Update it to the latest version \u2014 a \`^\` range on an older version will not pick it up:
  npm install ${pkg}@latest`;
  }
  return `The markdown processor "${name}" does not provide MDX support. Implement \`createMdxRenderer\` on the processor to enable MDX rendering.`;
}
async function resolveMdxRenderer(opts, sourcemap) {
  const { processor } = opts;
  if (!processor.createMdxRenderer) {
    throw new Error(mdxUnsupportedMessage(processor.name));
  }
  return processor.createMdxRenderer(
    {
      syntaxHighlight: opts.mdxOptions.syntaxHighlight,
      shikiConfig: opts.mdxOptions.shikiConfig,
      gfm: opts.mdxOptions.gfm,
      smartypants: opts.mdxOptions.smartypants
    },
    {
      optimize: opts.mdxOptions.optimize,
      srcDir: opts.srcDir,
      sourcemap
    }
  );
}
export {
  vitePluginMdx
};
