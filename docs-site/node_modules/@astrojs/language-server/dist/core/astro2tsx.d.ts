import type { ConvertToTSXOptions, TSXExtractedScript, TSXExtractedStyle, TSXResult } from '@astrojs/compiler/types';
import type { CodeMapping } from '@volar/language-core';
import { Range } from '@volar/language-server';
export interface LSPTSXRanges {
    frontmatter: Range;
    body: Range;
    scripts: TSXExtractedScript[];
    styles: TSXExtractedStyle[];
    generatedComponentExport?: Range;
}
export declare function safeConvertToTSX(content: string, options: ConvertToTSXOptions): TSXResult | {
    code: string;
    map: {
        file: string;
        sources: never[];
        sourcesContent: never[];
        names: never[];
        mappings: string;
        version: number;
    };
    diagnostics: {
        code: 1000;
        location: {
            file: string;
            line: number;
            column: number;
            length: number;
        };
        severity: 1;
        text: string;
    }[];
    metaRanges: {
        frontmatter: {
            start: number;
            end: number;
        };
        body: {
            start: number;
            end: number;
        };
        scripts: never[];
        styles: never[];
    };
};
export declare function getTSXRangesAsLSPRanges(tsx: TSXResult): LSPTSXRanges;
export declare function astro2tsx(input: string, fileName: string): {
    virtualCode: {
        id: string;
        languageId: string;
        snapshot: {
            getText: (start: number, end: number) => string;
            getLength: () => number;
            getChangeRange: () => undefined;
        };
        mappings: CodeMapping[];
        embeddedCodes: never[];
    };
    diagnostics: import("@astrojs/compiler/types").DiagnosticMessage[] | {
        code: 1000;
        location: {
            file: string;
            line: number;
            column: number;
            length: number;
        };
        severity: 1;
        text: string;
    }[];
    ranges: {
        generatedComponentExport: Range | undefined;
        frontmatter: Range;
        body: Range;
        scripts: TSXExtractedScript[];
        styles: TSXExtractedStyle[];
    };
};
