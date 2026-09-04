import type { UnifiedResolvedOptions } from '@astrojs/markdown-remark';
import type { MarkdownProcessor } from 'astro/markdown';
export declare const isUnifiedProcessor: (p: {
    name: string;
}) => p is MarkdownProcessor<UnifiedResolvedOptions>;
