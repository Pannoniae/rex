//#region src/utils/base.d.ts
/** Get the a root-relative URL path with the site’s `base` prefixed. */
declare function pathWithBase(path: string): string;
/** Get the a root-relative file URL path with the site’s `base` prefixed. */
declare function fileWithBase(path: string): string;
//#endregion
export { fileWithBase, pathWithBase };