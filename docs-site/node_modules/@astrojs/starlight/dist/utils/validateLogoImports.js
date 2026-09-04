import config from "virtual:starlight/user-config";
import { logos } from "virtual:starlight/user-images";
//#region src/utils/validateLogoImports.ts
/** Check user-imported logo images have resolved correctly. */
function validateLogoImports() {
	if (config.logo) {
		let err;
		if ("src" in config.logo) {
			if (!logos.dark || !logos.light) err = `Could not resolve logo import for "${config.logo.src}" (logo.src)`;
		} else if (!logos.dark) err = `Could not resolve logo import for "${config.logo.dark}" (logo.dark)`;
		else if (!logos.light) err = `Could not resolve logo import for "${config.logo.light}" (logo.light)`;
		if (err) throw new Error(err);
	}
}
//#endregion
export { validateLogoImports };
