//#region src/utils/url.d.ts
/** Check if a string starts with one of `http://` or `https://`. */
declare const isAbsoluteUrl: (link: string) => boolean;
/** Check if a string contains a protocol (e.g., `http:`, `https:`, `mailto:`). */
declare const hasProtocol: (link: string) => boolean;
//#endregion
export { hasProtocol, isAbsoluteUrl };