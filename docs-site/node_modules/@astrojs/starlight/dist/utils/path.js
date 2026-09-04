//#region src/utils/path.ts
/** Ensure the passed path starts with a leading slash. */
function ensureLeadingSlash(href) {
	if (href[0] !== "/") href = "/" + href;
	return href;
}
/** Ensure the passed path ends with a trailing slash. */
function ensureTrailingSlash(href) {
	if (href[href.length - 1] !== "/") href += "/";
	return href;
}
/** Ensure the passed path starts and ends with slashes. */
function ensureLeadingAndTrailingSlashes(href) {
	href = ensureLeadingSlash(href);
	href = ensureTrailingSlash(href);
	return href;
}
/** Ensure the passed path does not start with a leading slash. */
function stripLeadingSlash(href) {
	if (href[0] === "/") href = href.slice(1);
	return href;
}
/** Ensure the passed path does not end with a trailing slash. */
function stripTrailingSlash(href) {
	if (href[href.length - 1] === "/") href = href.slice(0, -1);
	return href;
}
/** Ensure the passed path does not start and end with slashes. */
function stripLeadingAndTrailingSlashes(href) {
	href = stripLeadingSlash(href);
	href = stripTrailingSlash(href);
	return href;
}
/** Remove the extension from a path. */
function stripHtmlExtension(path) {
	const pathWithoutTrailingSlash = stripTrailingSlash(path);
	return pathWithoutTrailingSlash.endsWith(".html") ? pathWithoutTrailingSlash.slice(0, -5) : path;
}
/** Add '.html' extension to a path. */
function ensureHtmlExtension(path) {
	path = stripLeadingAndTrailingSlashes(path);
	if (!path.endsWith(".html")) path = path ? path + ".html" : "/index.html";
	return ensureLeadingSlash(path);
}
/** Remove the extension from a path. */
function stripExtension(path) {
	const periodIndex = path.lastIndexOf(".");
	return path.slice(0, periodIndex > -1 ? periodIndex : void 0);
}
//#endregion
export { ensureHtmlExtension, ensureLeadingAndTrailingSlashes, ensureLeadingSlash, ensureTrailingSlash, stripExtension, stripHtmlExtension, stripLeadingAndTrailingSlashes, stripLeadingSlash, stripTrailingSlash };
