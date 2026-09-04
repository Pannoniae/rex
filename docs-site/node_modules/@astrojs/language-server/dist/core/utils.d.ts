import type { VirtualCode } from '@volar/language-core';
export declare function framework2tsx(filePath: string, sourceCode: string, framework: 'vue' | 'svelte'): VirtualCode;
export declare function classNameFromFilename(filename: string): string;
export declare function patchTSX(code: string, filePath: string): string;
export declare function patchTSXWithMetadata(code: string, filePath: string): {
    code: string;
    generatedComponentExport?: undefined;
} | {
    code: string;
    generatedComponentExport: {
        start: number;
        end: number;
    };
};
