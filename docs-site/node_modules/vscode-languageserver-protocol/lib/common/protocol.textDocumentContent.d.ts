import type { DocumentUri } from 'vscode-languageserver-types';
import type { RequestHandler } from 'vscode-jsonrpc';
import { MessageDirection, ProtocolRequestType, CM } from './messages';
import { type StaticRegistrationOptions } from './protocol';
/**
 * Client capabilities for a text document content provider.
 *
 * @since 3.18.0
 */
export type TextDocumentContentClientCapabilities = {
    /**
     * Text document content provider supports dynamic registration.
     */
    dynamicRegistration?: boolean;
};
/**
 * Text document content provider options.
 *
 * @since 3.18.0
 */
export type TextDocumentContentOptions = {
    /**
     * The schemes for which the server provides content.
     */
    schemes: string[];
};
/**
 * Text document content provider registration options.
 *
 * @since 3.18.0
 */
export type TextDocumentContentRegistrationOptions = TextDocumentContentOptions & StaticRegistrationOptions;
/**
 * Parameters for the `workspace/textDocumentContent` request.
 *
 * @since 3.18.0
 */
export interface TextDocumentContentParams {
    /**
     * The uri of the text document.
     */
    uri: DocumentUri;
}
/**
 * Result of the `workspace/textDocumentContent` request.
 *
 * @since 3.18.0
 */
export interface TextDocumentContentResult {
    /**
     * The text content of the text document. Please note, that the content of
     * any subsequent open notifications for the text document might differ
     * from the returned content due to whitespace and line ending
     * normalizations done on the client
     */
    text: string;
}
/**
 * The `workspace/textDocumentContent` request is sent from the client to the
 * server to request the content of a text document.
 *
 * @since 3.18.0
 */
export declare namespace TextDocumentContentRequest {
    const method: 'workspace/textDocumentContent';
    const messageDirection: MessageDirection;
    const type: ProtocolRequestType<TextDocumentContentParams, TextDocumentContentResult, void, void, TextDocumentContentRegistrationOptions>;
    type HandlerSignature = RequestHandler<TextDocumentContentParams, TextDocumentContentResult, void>;
    const capabilities: CM<"workspace.textDocumentContent", "workspace.textDocumentContent">;
}
/**
 * Parameters for the `workspace/textDocumentContent/refresh` request.
 *
 * @since 3.18.0
 */
export interface TextDocumentContentRefreshParams {
    /**
     * The uri of the text document to refresh.
     */
    uri: DocumentUri;
}
/**
 * The `workspace/textDocumentContent` request is sent from the server to the client to refresh
 * the content of a specific text document.
 *
 * @since 3.18.0
 */
export declare namespace TextDocumentContentRefreshRequest {
    const method: `workspace/textDocumentContent/refresh`;
    const messageDirection: MessageDirection;
    const type: ProtocolRequestType<TextDocumentContentRefreshParams, void, void, void, void>;
    type HandlerSignature = RequestHandler<TextDocumentContentRefreshParams, void, void>;
}
