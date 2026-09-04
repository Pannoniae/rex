"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.isModeline = exports.getSchemaFromModeline = void 0;
const yamlParser07_1 = require("../parser/yamlParser07");
/**
 * Retrieve schema if declared as modeline.
 * Public for testing purpose, not part of the API.
 * @param doc
 */
function getSchemaFromModeline(doc) {
    if (doc instanceof yamlParser07_1.SingleYAMLDocument) {
        const yamlLanguageServerModeline = doc.lineComments.find((lineComment) => {
            return isModeline(lineComment);
        });
        if (yamlLanguageServerModeline != undefined) {
            const schemaMatches = yamlLanguageServerModeline.match(/\$schema(?:=|:\s*)(\S+)/);
            if (schemaMatches !== null && schemaMatches.length === 2) {
                return schemaMatches[1];
            }
        }
    }
    return undefined;
}
exports.getSchemaFromModeline = getSchemaFromModeline;
function isModeline(lineText) {
    const matchModeline = lineText.match(/^#\s+(?:yaml-language-server\s*:|\$schema:)/g);
    return matchModeline !== null && matchModeline.length === 1;
}
exports.isModeline = isModeline;
//# sourceMappingURL=modelineUtil.js.map