import type { MarkdownProcessor } from 'astro/markdown';
import type { Plugin } from 'vite';
import type { ResolvedMdxOptions } from './index.js';
export interface VitePluginMdxOptions {
    mdxOptions: ResolvedMdxOptions;
    srcDir: URL;
    processor: MarkdownProcessor;
}
export declare function vitePluginMdx(opts: VitePluginMdxOptions): Plugin;
