"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterSuppressedDiagnostics = exports.shouldSuppressDiagnostic = exports.parseDisableSpecifiers = exports.YAML_DISABLE_PATTERN = void 0;
/**
 * Pattern that matches a `# yaml-language-server-disable` comment.
 *
 * Usage in YAML files:
 *
 *   - `# yaml-language-server-disable` - suppress ALL diagnostics on the next line
 *   - `# yaml-language-server-disable Incorrect type` - suppress diagnostics whose message contains "Incorrect type"
 *   - `# yaml-language-server-disable Incorrect type, not accepted` - suppress diagnostics matching any of the substrings
 *
 * Capture group 1 (optional) contains the comma-separated list of message
 * substrings to match against. If absent, all diagnostics are suppressed.
 */
exports.YAML_DISABLE_PATTERN = /^\s*#\s*yaml-language-server-disable\b(.*)$/;
/**
 * Parse the text after `yaml-language-server-disable` into an array of trimmed,
 * lower-cased message substrings.  Returns an empty array when no
 * specifiers are provided (meaning "suppress all").
 */
function parseDisableSpecifiers(raw) {
    const trimmed = raw.trim();
    if (!trimmed) {
        return [];
    }
    return trimmed
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter((s) => s.length > 0);
}
exports.parseDisableSpecifiers = parseDisableSpecifiers;
/**
 * Determine whether a diagnostic should be suppressed based on the
 * specifiers from a `# yaml-language-server-disable` comment.
 *
 * @param specifiers - Parsed specifiers (empty means suppress all).
 * @param diagnosticMessage - The diagnostic's message text.
 * @returns `true` if the diagnostic should be suppressed.
 */
function shouldSuppressDiagnostic(specifiers, diagnosticMessage) {
    if (specifiers.length === 0) {
        return true;
    }
    const lowerMessage = diagnosticMessage.toLowerCase();
    return specifiers.some((spec) => lowerMessage.includes(spec));
}
exports.shouldSuppressDiagnostic = shouldSuppressDiagnostic;
/**
 * Filters an array of diagnostics, removing any whose starting line is
 * immediately preceded by a `# yaml-language-server-disable` comment.
 *
 * When the comment includes one or more comma-separated message substrings,
 * only diagnostics whose message contains at least one of those substrings
 * (case-insensitive) are suppressed.  Without specifiers, all diagnostics
 * on the next line are suppressed.
 *
 * @param diagnostics - The diagnostics to filter.
 * @param getStartLine - Extracts the zero-based starting line number from a diagnostic.
 * @param getMessage - Extracts the message string from a diagnostic.
 * @param getLineText - Returns the text of a document line by its zero-based index,
 *   or `undefined` if the line is out of range.
 * @returns A new array containing only the diagnostics that are not suppressed.
 */
function filterSuppressedDiagnostics(diagnostics, getStartLine, getMessage, getLineText) {
    return diagnostics.filter((diag) => {
        const line = getStartLine(diag);
        if (line === 0) {
            return true;
        }
        const prevLineText = getLineText(line - 1);
        if (prevLineText === undefined) {
            return true;
        }
        const match = exports.YAML_DISABLE_PATTERN.exec(prevLineText);
        if (!match) {
            return true;
        }
        const specifiers = parseDisableSpecifiers(match[1]);
        return !shouldSuppressDiagnostic(specifiers, getMessage(diag));
    });
}
exports.filterSuppressedDiagnostics = filterSuppressedDiagnostics;
//# sourceMappingURL=diagnostic-filter.js.map