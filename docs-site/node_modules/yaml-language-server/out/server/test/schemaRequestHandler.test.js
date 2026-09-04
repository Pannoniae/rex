"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const schemaRequestHandler_1 = require("../src/languageservice/services/schemaRequestHandler");
const sinon = require("sinon");
const request = require("request-light");
const vscode_uri_1 = require("vscode-uri");
const chai = require("chai");
const sinonChai = require("sinon-chai");
const expect = chai.expect;
chai.use(sinonChai);
const testHelper_1 = require("./utils/testHelper");
describe('Schema Request Handler Tests', () => {
    describe('schemaRequestHandler', () => {
        const sandbox = sinon.createSandbox();
        let readFileStub;
        beforeEach(() => {
            readFileStub = sandbox.stub(testHelper_1.testFileSystem, 'readFile');
            readFileStub.returns(Promise.resolve('{some: "json"}'));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('Should care Win URI', async () => {
            const connection = {};
            const resultPromise = (0, schemaRequestHandler_1.schemaRequestHandler)(connection, 'c:\\some\\window\\path\\scheme.json', [], vscode_uri_1.URI.parse(''), false, testHelper_1.testFileSystem, false);
            expect(readFileStub).calledOnceWith('c:\\some\\window\\path\\scheme.json');
            const result = await resultPromise;
            expect(result).to.be.equal('{some: "json"}');
        });
        it('UNIX URI should works', async () => {
            const connection = {};
            const resultPromise = (0, schemaRequestHandler_1.schemaRequestHandler)(connection, '/some/unix/path/', [], vscode_uri_1.URI.parse(''), false, testHelper_1.testFileSystem, false);
            const result = await resultPromise;
            expect(result).to.be.equal('{some: "json"}');
        });
        it('should handle not valid Windows path', async () => {
            const connection = {};
            const resultPromise = (0, schemaRequestHandler_1.schemaRequestHandler)(connection, 'A:/some/window/path/scheme.json', [], vscode_uri_1.URI.parse(''), false, testHelper_1.testFileSystem, false);
            expect(readFileStub).calledOnceWith(vscode_uri_1.URI.file('a:/some/window/path/scheme.json').fsPath);
            const result = await resultPromise;
            expect(result).to.be.equal('{some: "json"}');
        });
    });
    describe('HTTP(S) schema requests', () => {
        const sandbox = sinon.createSandbox();
        let xhrStub;
        const connection = {};
        beforeEach(() => {
            xhrStub = sandbox.stub(request, 'xhr');
            xhrStub.resolves({ responseText: '{"$schema":"http://json-schema.org/draft-07/schema"}', status: 200 });
        });
        afterEach(() => {
            sandbox.restore();
            delete process.env.YAML_LANGUAGE_SERVER_VERSION;
        });
        it('should send correct User-Agent with version, Node runtime and platform', async () => {
            process.env.YAML_LANGUAGE_SERVER_VERSION = '1.0.0-test';
            await (0, schemaRequestHandler_1.schemaRequestHandler)(connection, 'https://example.com/schema.json', [], vscode_uri_1.URI.parse(''), false, testHelper_1.testFileSystem, false);
            expect(xhrStub).calledOnce;
            const { headers } = xhrStub.firstCall.args[0];
            expect(headers['User-Agent']).to.equal(`yaml-language-server/1.0.0-test (RedHat) node/${process.versions.node} (${process.platform})`);
        });
        it('should fall back to "unknown" version when YAML_LANGUAGE_SERVER_VERSION is not set', async () => {
            delete process.env.YAML_LANGUAGE_SERVER_VERSION;
            await (0, schemaRequestHandler_1.schemaRequestHandler)(connection, 'https://example.com/schema.json', [], vscode_uri_1.URI.parse(''), false, testHelper_1.testFileSystem, false);
            const { headers } = xhrStub.firstCall.args[0];
            expect(headers['User-Agent']).to.match(/^yaml-language-server\/unknown \(RedHat\)/);
        });
        it('should send User-Agent on http:// URIs as well as https://', async () => {
            process.env.YAML_LANGUAGE_SERVER_VERSION = '2.0.0';
            await (0, schemaRequestHandler_1.schemaRequestHandler)(connection, 'http://example.com/schema.json', [], vscode_uri_1.URI.parse(''), false, testHelper_1.testFileSystem, false);
            const { headers } = xhrStub.firstCall.args[0];
            expect(headers['User-Agent']).to.match(/^yaml-language-server\/2\.0\.0 \(RedHat\)/);
        });
        it('should preserve Accept-Encoding header alongside User-Agent', async () => {
            await (0, schemaRequestHandler_1.schemaRequestHandler)(connection, 'https://example.com/schema.json', [], vscode_uri_1.URI.parse(''), false, testHelper_1.testFileSystem, false);
            const { headers } = xhrStub.firstCall.args[0];
            expect(headers['Accept-Encoding']).to.equal('gzip, deflate');
        });
        it('should return the response text on success', async () => {
            const result = await (0, schemaRequestHandler_1.schemaRequestHandler)(connection, 'https://example.com/schema.json', [], vscode_uri_1.URI.parse(''), false, testHelper_1.testFileSystem, false);
            expect(result).to.equal('{"$schema":"http://json-schema.org/draft-07/schema"}');
        });
        it('should reject with responseText on xhr error', async () => {
            xhrStub.rejects({ responseText: 'Not Found', status: 404 });
            try {
                await (0, schemaRequestHandler_1.schemaRequestHandler)(connection, 'https://example.com/schema.json', [], vscode_uri_1.URI.parse(''), false, testHelper_1.testFileSystem, false);
                expect.fail('Expected promise to be rejected');
            }
            catch (err) {
                expect(err).to.equal('Not Found');
            }
        });
    });
});
//# sourceMappingURL=schemaRequestHandler.test.js.map