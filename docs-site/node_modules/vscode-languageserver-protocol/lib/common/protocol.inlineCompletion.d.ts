import { InlineCompletionItem, InlineCompletionContext, InlineCompletionList } from 'vscode-languageserver-types';
import { RequestHandler } from 'vscode-jsonrpc';
import { CM, MessageDirection, ProtocolRequestType } from './messages';
import { type TextDocumentRegistrationOptions, type WorkDoneProgressOptions, type StaticRegistrationOptions, type WorkDoneProgressParams, type TextDocumentPositionParams } from './protocol';
/**
 * Client capabilities specific to inline completions.
 *
 * @since 3.18.0
 */
export type InlineCompletionClientCapabilities = {
    /**
     * Whether implementation supports dynamic registration for inline completion providers.
     */
    dynamicRegistration?: boolean;
};
/**
 * Inline completion options used during static registration.
 *
 * @since 3.18.0
 */
export type InlineCompletionOptions = WorkDoneProgressOptions;
/**
 * Inline completion options used during static or dynamic registration.
 *
 * @since 3.18.0
 */
export type InlineCompletionRegistrationOptions = InlineCompletionOptions & TextDocumentRegistrationOptions & StaticRegistrationOptions;
/**
 * A parameter literal used in inline completion requests.
 *
 * @since 3.18.0
 */
export type InlineCompletionParams = WorkDoneProgressParams & TextDocumentPositionParams & {
    /**
     * Additional information about the context in which inline completions were
     * requested.
     */
    context: InlineCompletionContext;
};
/**
 * A request to provide inline completions in a document. The request's parameter is of
 * type {@link InlineCompletionParams}, the response is of type
 * {@link InlineCompletion InlineCompletion[]} or a Thenable that resolves to such.
 *
 * @since 3.18.0
 */
export declare namespace InlineCompletionRequest {
    const method: 'textDocument/inlineCompletion';
    const messageDirection: MessageDirection;
    const type: ProtocolRequestType<InlineCompletionParams, InlineCompletionList | InlineCompletionItem[] | null, InlineCompletionItem[], void, InlineCompletionRegistrationOptions>;
    type HandlerSignature = RequestHandler<InlineCompletionParams, InlineCompletionList | InlineCompletionItem[] | null, void>;
    const capabilities: CM<"textDocument.inlineCompletion", "inlineCompletionProvider">;
}
