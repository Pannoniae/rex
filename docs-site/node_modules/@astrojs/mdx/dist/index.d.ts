import { type AstroMarkdownOptions, type PluggableList, type RemarkRehype as RemarkRehypeOptions } from '@astrojs/internal-helpers/markdown';
import type { AstroIntegration, AstroRenderer } from 'astro';
import type { MarkdownProcessor } from 'astro/markdown';
/** MDX static-optimization options. Mirror of the pipeline's `OptimizeOptions`. */
export interface OptimizeOptions {
    ignoreElementNames?: string[];
}
type SharedMarkdownOptions = Required<Pick<AstroMarkdownOptions, 'syntaxHighlight' | 'shikiConfig'>> & Pick<AstroMarkdownOptions, 'gfm' | 'smartypants'>;
export type MdxOptions = SharedMarkdownOptions & {
    extendMarkdownConfig: boolean;
    /**
     * @deprecated Pass `recmaPlugins` to `unified({ recmaPlugins })` from `@astrojs/markdown-remark` and set it as `markdown.processor` instead. Will be removed in a future major.
     */
    recmaPlugins: PluggableList;
    optimize: boolean | OptimizeOptions;
    /**
     * Override the markdown processor for `.mdx` files. Defaults to `config.markdown.processor`,
     * or to a clean `satteri()` processor when `extendMarkdownConfig` is `false`.
     * Use this to run `.mdx` files through a different processor (or the same processor with
     * different options) than your `.md` files. It is never replaced: the deprecated
     * `remarkPlugins`, `rehypePlugins`, `recmaPlugins` and `remarkRehype` options apply only
     * when the processor is `unified`, and are ignored with a warning otherwise.
     */
    processor?: MarkdownProcessor;
    /**
     * @deprecated Pass `remarkPlugins` to `unified({ remarkPlugins })` from `@astrojs/markdown-remark` and set it as `markdown.processor` instead — MDX will inherit them. Will be removed in a future major.
     */
    remarkPlugins: PluggableList;
    /**
     * @deprecated Pass `rehypePlugins` to `unified({ rehypePlugins })` from `@astrojs/markdown-remark` and set it as `markdown.processor` instead — MDX will inherit them. Will be removed in a future major.
     */
    rehypePlugins: PluggableList;
    /**
     * @deprecated Pass `remarkRehype` to `unified({ remarkRehype })` from `@astrojs/markdown-remark` and set it as `markdown.processor` instead — MDX will inherit it. Will be removed in a future major.
     */
    remarkRehype: RemarkRehypeOptions;
};
/**
 * @deprecated Import `getContainerRenderer` from `@astrojs/mdx/container-renderer` instead.
 */
export declare function getContainerRenderer(): AstroRenderer;
export default function mdx(partialMdxOptions?: Partial<MdxOptions>): AstroIntegration;
export {};
