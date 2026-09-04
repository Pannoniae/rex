import type { SerializedStaticImage } from '../../assets/types.js';
/** Start collecting the image transforms resolved on the current path. */
export declare function beginImageCollection(): void;
/** Record an image transform resolved while rendering the current path. */
export declare function recordStaticImage(image: SerializedStaticImage): void;
/**
 * Finish collection and return the collected transforms, or `undefined` when no
 * collection was active (so callers can distinguish "no images" from
 * "not tracked").
 */
export declare function endImageCollection(): SerializedStaticImage[] | undefined;
