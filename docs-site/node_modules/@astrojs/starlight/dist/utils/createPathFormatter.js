import { ensureHtmlExtension, ensureTrailingSlash, stripHtmlExtension, stripTrailingSlash } from "./path.js";
import { fileWithBase, pathWithBase } from "./base.js";
//#region src/utils/createPathFormatter.ts
const defaultFormatStrategy = {
	addBase: pathWithBase,
	handleExtension: (href) => stripHtmlExtension(href)
};
const formatStrategies = {
	file: {
		addBase: fileWithBase,
		handleExtension: (href) => ensureHtmlExtension(href)
	},
	directory: defaultFormatStrategy,
	preserve: defaultFormatStrategy
};
const trailingSlashStrategies = {
	always: ensureTrailingSlash,
	never: stripTrailingSlash,
	ignore: (href) => href
};
/** Format a path based on the project config. */
function formatPath(href, { format = "directory", trailingSlash = "ignore" }) {
	const formatStrategy = formatStrategies[format];
	const trailingSlashStrategy = trailingSlashStrategies[trailingSlash];
	href = formatStrategy.handleExtension(href);
	href = formatStrategy.addBase(href);
	if (format === "file") return href;
	href = href === "/" ? href : trailingSlashStrategy(href);
	return href;
}
function createPathFormatter(opts) {
	return (href) => formatPath(href, opts);
}
//#endregion
export { createPathFormatter };
