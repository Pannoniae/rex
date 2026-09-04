import type { ResolvedServerUrls } from 'vite';
import { type Flags } from '../flags.js';
interface DevOptions {
    flags: Flags;
}
/**
 * `yargs-parser` camel-cases `--ignore-lock` to `flags.ignoreLock`.
 */
export declare function isIgnoreLock(flags: Flags): boolean;
/**
 * `--ignore-lock` skips the lock file entirely, so a background dev server started with it
 * could never be found by `astro dev stop`/`status`/`logs`. Returns an error message if
 * background mode (explicit `--background`, or implied by AI agent detection) is combined
 * with `--ignore-lock`, or `null` if there's no conflict.
 */
export declare function getBackgroundIgnoreLockConflict(flags: Flags, wantsBackground: boolean): string | null;
/**
 * Pick the URL to record in the lock file.
 *
 * Vite only reports a `local` URL for loopback hosts. With `--host <custom-address>` set to a
 * specific non-loopback address the URL lands in `network` instead and `local` is empty, so
 * prefer `local` but fall back to `network` rather than reading `undefined`.
 *
 * Returns `null` when the server exposed no usable URL, which leaves the (purely bookkeeping)
 * lock file unwritten instead of taking down an otherwise healthy dev server.
 */
export declare function resolveLockFileUrl(resolvedUrls: ResolvedServerUrls): string | null;
/**
 * `--force` (replace the existing server) and `--ignore-lock` (start alongside it,
 * untracked) express contradictory intent. Returns an error message if both are set,
 * or `null` otherwise.
 */
export declare function getForceIgnoreLockConflict(flags: Flags): string | null;
export declare function dev({ flags }: DevOptions): Promise<import("../../core/dev/dev.js").DevServer | undefined>;
export {};
