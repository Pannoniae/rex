"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticTokensRefreshRequest = exports.SemanticTokensRangeRequest = exports.SemanticTokensDeltaRequest = exports.SemanticTokensRequest = exports.SemanticTokensRegistrationType = exports.TokenFormat = void 0;
const messages_1 = require("./messages");
//------- 'textDocument/semanticTokens' -----
var TokenFormat;
(function (TokenFormat) {
    TokenFormat.Relative = 'relative';
})(TokenFormat || (exports.TokenFormat = TokenFormat = {}));
var SemanticTokensRegistrationType;
(function (SemanticTokensRegistrationType) {
    SemanticTokensRegistrationType.method = 'textDocument/semanticTokens';
    SemanticTokensRegistrationType.type = new messages_1.RegistrationType(SemanticTokensRegistrationType.method);
})(SemanticTokensRegistrationType || (exports.SemanticTokensRegistrationType = SemanticTokensRegistrationType = {}));
/**
 * @since 3.16.0
 */
var SemanticTokensRequest;
(function (SemanticTokensRequest) {
    SemanticTokensRequest.method = 'textDocument/semanticTokens/full';
    SemanticTokensRequest.messageDirection = messages_1.MessageDirection.clientToServer;
    SemanticTokensRequest.type = new messages_1.ProtocolRequestType(SemanticTokensRequest.method);
    SemanticTokensRequest.registrationMethod = SemanticTokensRegistrationType.method;
    SemanticTokensRequest.capabilities = messages_1.CM.create('textDocument.semanticTokens', 'semanticTokensProvider');
})(SemanticTokensRequest || (exports.SemanticTokensRequest = SemanticTokensRequest = {}));
/**
 * @since 3.16.0
 */
var SemanticTokensDeltaRequest;
(function (SemanticTokensDeltaRequest) {
    SemanticTokensDeltaRequest.method = 'textDocument/semanticTokens/full/delta';
    SemanticTokensDeltaRequest.messageDirection = messages_1.MessageDirection.clientToServer;
    SemanticTokensDeltaRequest.type = new messages_1.ProtocolRequestType(SemanticTokensDeltaRequest.method);
    SemanticTokensDeltaRequest.registrationMethod = SemanticTokensRegistrationType.method;
    SemanticTokensDeltaRequest.capabilities = messages_1.CM.create('textDocument.semanticTokens.requests.full.delta', 'semanticTokensProvider.full.delta');
})(SemanticTokensDeltaRequest || (exports.SemanticTokensDeltaRequest = SemanticTokensDeltaRequest = {}));
/**
 * @since 3.16.0
 */
var SemanticTokensRangeRequest;
(function (SemanticTokensRangeRequest) {
    SemanticTokensRangeRequest.method = 'textDocument/semanticTokens/range';
    SemanticTokensRangeRequest.messageDirection = messages_1.MessageDirection.clientToServer;
    SemanticTokensRangeRequest.type = new messages_1.ProtocolRequestType(SemanticTokensRangeRequest.method);
    SemanticTokensRangeRequest.registrationMethod = SemanticTokensRegistrationType.method;
    SemanticTokensRangeRequest.capabilities = messages_1.CM.create('textDocument.semanticTokens.requests.range', 'semanticTokensProvider.range');
})(SemanticTokensRangeRequest || (exports.SemanticTokensRangeRequest = SemanticTokensRangeRequest = {}));
/**
 * @since 3.16.0
 */
var SemanticTokensRefreshRequest;
(function (SemanticTokensRefreshRequest) {
    SemanticTokensRefreshRequest.method = `workspace/semanticTokens/refresh`;
    SemanticTokensRefreshRequest.messageDirection = messages_1.MessageDirection.serverToClient;
    SemanticTokensRefreshRequest.type = new messages_1.ProtocolRequestType0(SemanticTokensRefreshRequest.method);
    SemanticTokensRefreshRequest.capabilities = messages_1.CM.create('workspace.semanticTokens.refreshSupport', undefined);
})(SemanticTokensRefreshRequest || (exports.SemanticTokensRefreshRequest = SemanticTokensRefreshRequest = {}));
