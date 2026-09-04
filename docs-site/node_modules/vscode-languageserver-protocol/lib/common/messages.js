"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CM = exports.ProtocolNotificationType = exports.ProtocolNotificationType0 = exports.ProtocolRequestType = exports.ProtocolRequestType0 = exports.RegistrationType = exports.MessageDirection = void 0;
const vscode_jsonrpc_1 = require("vscode-jsonrpc");
var MessageDirection;
(function (MessageDirection) {
    MessageDirection["clientToServer"] = "clientToServer";
    MessageDirection["serverToClient"] = "serverToClient";
    MessageDirection["both"] = "both";
})(MessageDirection || (exports.MessageDirection = MessageDirection = {}));
class RegistrationType {
    /**
     * Clients must not use this property. It is here to ensure correct typing.
     */
    ____;
    method;
    constructor(method) {
        this.method = method;
    }
}
exports.RegistrationType = RegistrationType;
class ProtocolRequestType0 extends vscode_jsonrpc_1.RequestType0 {
    /**
     * Clients must not use these properties. They are here to ensure correct typing.
     * in TypeScript
     */
    __;
    ___;
    ____;
    _pr;
    constructor(method) {
        super(method);
    }
}
exports.ProtocolRequestType0 = ProtocolRequestType0;
class ProtocolRequestType extends vscode_jsonrpc_1.RequestType {
    /**
     * Clients must not use this property. It is here to ensure correct typing.
     */
    __;
    ___;
    ____;
    _pr;
    constructor(method) {
        super(method, vscode_jsonrpc_1.ParameterStructures.byName);
    }
}
exports.ProtocolRequestType = ProtocolRequestType;
class ProtocolNotificationType0 extends vscode_jsonrpc_1.NotificationType0 {
    /**
     * Clients must not use this property. It is here to ensure correct typing.
     */
    ___;
    ____;
    constructor(method) {
        super(method);
    }
}
exports.ProtocolNotificationType0 = ProtocolNotificationType0;
class ProtocolNotificationType extends vscode_jsonrpc_1.NotificationType {
    /**
     * Clients must not use this property. It is here to ensure correct typing.
     */
    ___;
    ____;
    constructor(method) {
        super(method, vscode_jsonrpc_1.ParameterStructures.byName);
    }
}
exports.ProtocolNotificationType = ProtocolNotificationType;
var CM;
(function (CM) {
    function create(client, server) {
        return { client, server };
    }
    CM.create = create;
})(CM || (exports.CM = CM = {}));
