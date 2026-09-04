"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const diagnostic_filter_1 = require("../src/languageservice/utils/diagnostic-filter");
function makeDiag(startLine, message) {
    return { startLine, message };
}
function linesOf(lines) {
    return (line) => (line >= 0 && line < lines.length ? lines[line] : undefined);
}
describe('YAML_DISABLE_PATTERN', () => {
    it('should capture specifiers in group 1', () => {
        const match = diagnostic_filter_1.YAML_DISABLE_PATTERN.exec('# yaml-language-server-disable Incorrect type, not accepted');
        (0, chai_1.expect)(match).to.not.be.null;
        (0, chai_1.expect)(match[1].trim()).to.equal('Incorrect type, not accepted');
    });
    it('should capture empty group 1 when no specifiers given', () => {
        const match = diagnostic_filter_1.YAML_DISABLE_PATTERN.exec('# yaml-language-server-disable');
        (0, chai_1.expect)(match).to.not.be.null;
        (0, chai_1.expect)(match[1].trim()).to.equal('');
    });
});
describe('parseDisableSpecifiers', () => {
    it('should return empty array for empty string', () => {
        (0, chai_1.expect)((0, diagnostic_filter_1.parseDisableSpecifiers)('')).to.deep.equal([]);
    });
    it('should return empty array for whitespace-only string', () => {
        (0, chai_1.expect)((0, diagnostic_filter_1.parseDisableSpecifiers)('   ')).to.deep.equal([]);
    });
    it('should parse a single specifier', () => {
        (0, chai_1.expect)((0, diagnostic_filter_1.parseDisableSpecifiers)('Incorrect type')).to.deep.equal(['incorrect type']);
    });
    it('should parse comma-separated specifiers', () => {
        (0, chai_1.expect)((0, diagnostic_filter_1.parseDisableSpecifiers)('Incorrect type, not accepted')).to.deep.equal(['incorrect type', 'not accepted']);
    });
    it('should trim whitespace around specifiers', () => {
        (0, chai_1.expect)((0, diagnostic_filter_1.parseDisableSpecifiers)('  foo ,  bar  ')).to.deep.equal(['foo', 'bar']);
    });
    it('should ignore empty entries from trailing commas', () => {
        (0, chai_1.expect)((0, diagnostic_filter_1.parseDisableSpecifiers)('foo,')).to.deep.equal(['foo']);
    });
    it('should lower-case all specifiers', () => {
        (0, chai_1.expect)((0, diagnostic_filter_1.parseDisableSpecifiers)('Value Is NOT Accepted')).to.deep.equal(['value is not accepted']);
    });
});
describe('shouldSuppressDiagnostic', () => {
    it('should suppress when specifiers is empty (suppress all)', () => {
        (0, chai_1.expect)((0, diagnostic_filter_1.shouldSuppressDiagnostic)([], 'any message')).to.be.true;
    });
    it('should suppress when message contains the specifier (case-insensitive)', () => {
        (0, chai_1.expect)((0, diagnostic_filter_1.shouldSuppressDiagnostic)(['incorrect type'], 'Incorrect type. Expected string.')).to.be.true;
    });
    it('should not suppress when message does not contain the specifier', () => {
        (0, chai_1.expect)((0, diagnostic_filter_1.shouldSuppressDiagnostic)(['not accepted'], 'Incorrect type. Expected string.')).to.be.false;
    });
    it('should suppress when any of multiple specifiers matches', () => {
        (0, chai_1.expect)((0, diagnostic_filter_1.shouldSuppressDiagnostic)(['not accepted', 'incorrect type'], 'Incorrect type. Expected string.')).to.be.true;
    });
    it('should not suppress when none of multiple specifiers match', () => {
        (0, chai_1.expect)((0, diagnostic_filter_1.shouldSuppressDiagnostic)(['not accepted', 'missing property'], 'Incorrect type. Expected string.')).to.be.false;
    });
});
describe('filterSuppressedDiagnostics', () => {
    const filter = (diagnostics, lines) => (0, diagnostic_filter_1.filterSuppressedDiagnostics)(diagnostics, (d) => d.startLine, (d) => d.message, lines);
    it('should return all diagnostics when there are no suppression comments', () => {
        const lines = linesOf(['key: value', 'other: 123']);
        const diagnostics = [makeDiag(0, 'error on line 0'), makeDiag(1, 'error on line 1')];
        const result = filter(diagnostics, lines);
        (0, chai_1.expect)(result).to.have.length(2);
    });
    it('should suppress all diagnostics when no specifiers are given', () => {
        const lines = linesOf(['name: hello', '# yaml-language-server-disable', 'age: not-a-number']);
        const diagnostics = [makeDiag(2, 'Incorrect type'), makeDiag(2, 'Value not accepted')];
        const result = filter(diagnostics, lines);
        (0, chai_1.expect)(result).to.be.empty;
    });
    it('should suppress only matching diagnostics when specifiers are given', () => {
        const lines = linesOf(['name: hello', '# yaml-language-server-disable Incorrect type', 'age: not-a-number']);
        const diagnostics = [makeDiag(2, 'Incorrect type. Expected string.'), makeDiag(2, 'Value is not accepted.')];
        const result = filter(diagnostics, lines);
        (0, chai_1.expect)(result).to.have.length(1);
        (0, chai_1.expect)(result[0].message).to.equal('Value is not accepted.');
    });
    it('should suppress diagnostics matching any of multiple comma-separated specifiers', () => {
        const lines = linesOf(['# yaml-language-server-disable Incorrect type, not accepted', 'key: bad']);
        const diagnostics = [
            makeDiag(1, 'Incorrect type. Expected string.'),
            makeDiag(1, 'Value is not accepted.'),
            makeDiag(1, 'Missing required property "name".'),
        ];
        const result = filter(diagnostics, lines);
        (0, chai_1.expect)(result).to.have.length(1);
        (0, chai_1.expect)(result[0].message).to.equal('Missing required property "name".');
    });
    it('should match specifiers case-insensitively', () => {
        const lines = linesOf(['# yaml-language-server-disable incorrect TYPE', 'key: bad']);
        const diagnostics = [makeDiag(1, 'Incorrect type. Expected string.')];
        const result = filter(diagnostics, lines);
        (0, chai_1.expect)(result).to.be.empty;
    });
    it('should keep diagnostics on lines NOT preceded by a disable comment', () => {
        const lines = linesOf(['name: hello', '# yaml-language-server-disable', 'age: bad', 'score: bad']);
        const diagnostics = [makeDiag(2, 'error on line 2'), makeDiag(3, 'error on line 3')];
        const result = filter(diagnostics, lines);
        (0, chai_1.expect)(result).to.have.length(1);
        (0, chai_1.expect)(result[0].message).to.equal('error on line 3');
    });
    it('should not filter a diagnostic on line 0 (no preceding line)', () => {
        const lines = linesOf(['bad: value']);
        const diagnostics = [makeDiag(0, 'error on first line')];
        const result = filter(diagnostics, lines);
        (0, chai_1.expect)(result).to.have.length(1);
    });
    it('should handle indented disable comments', () => {
        const lines = linesOf(['root:', '  # yaml-language-server-disable', '  child: bad-value']);
        const diagnostics = [makeDiag(2, 'invalid value')];
        const result = filter(diagnostics, lines);
        (0, chai_1.expect)(result).to.be.empty;
    });
    it('should not suppress when the disable comment is two lines above', () => {
        const lines = linesOf(['# yaml-language-server-disable', 'good: value', 'bad: value']);
        const diagnostics = [makeDiag(2, 'error on line 2')];
        const result = filter(diagnostics, lines);
        (0, chai_1.expect)(result).to.have.length(1);
    });
    it('should handle multiple disable comments for different lines', () => {
        const lines = linesOf([
            '# yaml-language-server-disable',
            'line1: bad',
            'line2: ok',
            '# yaml-language-server-disable',
            'line4: also-bad',
        ]);
        const diagnostics = [makeDiag(1, 'error on line 1'), makeDiag(2, 'error on line 2'), makeDiag(4, 'error on line 4')];
        const result = filter(diagnostics, lines);
        (0, chai_1.expect)(result).to.have.length(1);
        (0, chai_1.expect)(result[0].message).to.equal('error on line 2');
    });
    it('should return all diagnostics when the document cannot be read', () => {
        const noDocument = () => undefined;
        const diagnostics = [makeDiag(1, 'some error')];
        const result = filter(diagnostics, noDocument);
        (0, chai_1.expect)(result).to.have.length(1);
    });
    it('should return an empty array when given no diagnostics', () => {
        const lines = linesOf(['# yaml-language-server-disable', 'key: value']);
        const result = filter([], lines);
        (0, chai_1.expect)(result).to.be.empty;
    });
    it('should not treat a non-comment line containing the keyword as suppression', () => {
        const lines = linesOf(['key: yaml-language-server-disable', 'other: bad']);
        const diagnostics = [makeDiag(1, 'error on line 1')];
        const result = filter(diagnostics, lines);
        (0, chai_1.expect)(result).to.have.length(1);
    });
});
//# sourceMappingURL=diagnostic-filter.test.js.map