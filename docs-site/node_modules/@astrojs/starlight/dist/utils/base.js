import { stripLeadingSlash, stripTrailingSlash } from "./path.js";
//#region src/utils/base.ts
const base = stripTrailingSlash(import.meta.env.BASE_URL);
/** Get the a root-relative URL path with the site’s `base` prefixed. */
function pathWithBase(path) {
	path = stripLeadingSlash(path);
	return path ? base + "/" + path : base + "/";
}
/** Get the a root-relative file URL path with the site’s `base` prefixed. */
function fileWithBase(path) {
	path = stripLeadingSlash(path);
	return path ? base + "/" + path : base;
}
//#endregion
export { fileWithBase, pathWithBase };
