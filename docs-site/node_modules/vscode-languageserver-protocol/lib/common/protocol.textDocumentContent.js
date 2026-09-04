"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextDocumentContentRefreshRequest = exports.TextDocumentContentRequest = void 0;
const messages_1 = require("./messages");
/**
 * The `workspace/textDocumentContent` request is sent from the client to the
 * server to request the content of a text document.
 *
 * @since 3.18.0
 */
var TextDocumentContentRequest;
(function (TextDocumentContentRequest) {
    TextDocumentContentRequest.method = 'workspace/textDocumentContent';
    TextDocumentContentRequest.messageDirection = messages_1.MessageDirection.clientToServer;
    TextDocumentContentRequest.type = new messages_1.ProtocolRequestType(TextDocumentContentRequest.method);
    TextDocumentContentRequest.capabilities = messages_1.CM.create('workspace.textDocumentContent', 'workspace.textDocumentContent');
})(TextDocumentContentRequest || (exports.TextDocumentContentRequest = TextDocumentContentRequest = {}));
/**
 * The `workspace/textDocumentContent` request is sent from the server to the client to refresh
 * the content of a specific text document.
 *
 * @since 3.18.0
 */
var TextDocumentContentRefreshRequest;
(function (TextDocumentContentRefreshRequest) {
    TextDocumentContentRefreshRequest.method = `workspace/textDocumentContent/refresh`;
    TextDocumentContentRefreshRequest.messageDirection = messages_1.MessageDirection.serverToClient;
    TextDocumentContentRefreshRequest.type = new messages_1.ProtocolRequestType(TextDocumentContentRefreshRequest.method);
})(TextDocumentContentRefreshRequest || (exports.TextDocumentContentRefreshRequest = TextDocumentContentRefreshRequest = {}));
