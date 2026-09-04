import type { AstroConfig } from 'astro';
export declare function appendForwardSlash(path: string): string;
export interface FileInfo {
    fileId: string;
    fileUrl: string;
}
/** @see 'vite-plugin-utils' for source */
export declare function getFileInfo(id: string, config: AstroConfig): FileInfo;
/**
 * Match YAML exception handling from Astro core errors
 * @see 'astro/src/core/errors.ts'
 */
export declare function safeParseFrontmatter(code: string, id: string): import("@astrojs/internal-helpers/frontmatter").ParseFrontmatterResult;
