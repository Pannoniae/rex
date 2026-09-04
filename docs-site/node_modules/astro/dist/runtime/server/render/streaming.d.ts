import type { SSRResult } from '../../../types/public/internal.js';
import { type RenderDestination } from './common.js';
/**
 * Streaming render engine.
 *
 * Walks the component tree in a single forward pass (explicit stack), batching
 * consecutive static fragments into one write. The static structure
 * (RenderTemplateResult HTML parts, arrays, primitives) never allocates a node
 * object and never wraps HTML parts in `markHTMLString`, so static-heavy pages
 * render with minimal overhead.
 *
 * Dynamic subtrees (components, render instances, promises, JSX) are rendered
 * via `renderChild`. While their output stays synchronous, the engine streams
 * it straight to `destination`. As soon as a dynamic node renders
 * asynchronously, the engine switches to a buffered tail: every remaining
 * dynamic node is started eagerly (so async work runs in parallel) and the
 * buffers are flushed in order. This mirrors `RenderTemplateResult.render`, so
 * async components render concurrently rather than serially.
 *
 * Head propagation is handled by the caller (`bufferHeadContent`) before this
 * runs.
 */
export declare function renderStreaming(root: unknown, result: SSRResult, destination: RenderDestination): Promise<void>;
