/** Start collecting the content entries rendered on the current path. */
export declare function beginContentEntryCollection(): void;
/** Record that a content entry was rendered, keyed by its root-relative `filePath`. */
export declare function recordContentEntryRender(filePath: string | undefined): void;
/**
 * Finish collection and return the rendered entries, or `undefined` when no
 * collection was active (so callers can distinguish "nothing rendered" from
 * "not tracked").
 */
export declare function endContentEntryCollection(): string[] | undefined;
