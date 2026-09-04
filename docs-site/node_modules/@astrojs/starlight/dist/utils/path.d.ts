//#region src/utils/path.d.ts
/** Ensure the passed path starts with a leading slash. */
declare function ensureLeadingSlash(href: string): string;
/** Ensure the passed path ends with a trailing slash. */
declare function ensureTrailingSlash(href: string): string;
/** Ensure the passed path starts and ends with slashes. */
declare function ensureLeadingAndTrailingSlashes(href: string): string;
/** Ensure the passed path does not start with a leading slash. */
declare function stripLeadingSlash(href: string): string;
/** Ensure the passed path does not end with a trailing slash. */
declare function stripTrailingSlash(href: string): string;
/** Ensure the passed path does not start and end with slashes. */
declare function stripLeadingAndTrailingSlashes(href: string): string;
/** Remove the extension from a path. */
declare function stripHtmlExtension(path: string): string;
/** Add '.html' extension to a path. */
declare function ensureHtmlExtension(path: string): string;
/** Remove the extension from a path. */
declare function stripExtension(path: string): string;
//#endregion
export { ensureHtmlExtension, ensureLeadingAndTrailingSlashes, ensureLeadingSlash, ensureTrailingSlash, stripExtension, stripHtmlExtension, stripLeadingAndTrailingSlashes, stripLeadingSlash, stripTrailingSlash };