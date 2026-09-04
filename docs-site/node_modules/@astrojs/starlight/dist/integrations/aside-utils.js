import { Icons } from "../components-internals/Icons.js";
import { AstroError } from "astro/errors";
//#region src/integrations/aside-utils.ts
const asideVariants = [
	"note",
	"tip",
	"caution",
	"danger"
];
const asideIconNames = {
	note: "information",
	tip: "rocket",
	caution: "warning",
	danger: "error"
};
const asideVariantSet = new Set(asideVariants);
function isAsideVariant(value) {
	return asideVariantSet.has(value);
}
function getAsideIconName(variant, customIcon) {
	let iconName = asideIconNames[variant];
	if (customIcon) {
		iconName = customIcon;
		if (!Icons[iconName]) throwInvalidAsideIconError(iconName);
	}
	return iconName;
}
function getAsideIcon(variant, customIcon) {
	return Icons[getAsideIconName(variant, customIcon)];
}
function throwInvalidAsideIconError(icon) {
	throw new AstroError("Invalid aside icon", `An aside custom icon must be set to the name of one of Starlight’s built-in icons, but received \`${icon}\`.\n\nSee https://starlight.astro.build/reference/icons/#all-icons for a list of available icons.`);
}
//#endregion
export { asideVariants, getAsideIcon, getAsideIconName, isAsideVariant };
