import { AstroError } from "astro/errors";
//#region src/utils/i18n.ts
/**
* A list of well-known right-to-left languages used as a fallback when determining the text
* direction of a locale is not supported by the `Intl.Locale` API in the current environment.
*
* @see getLocaleDir()
* @see https://en.wikipedia.org/wiki/IETF_language_tag#List_of_common_primary_language_subtags
*/
const wellKnownRTL = [
	"ar",
	"fa",
	"he",
	"prs",
	"ps",
	"syc",
	"ug",
	"ur"
];
/** Information about the built-in default locale used as a fallback when no locales are defined. */
const BuiltInDefaultLocale = {
	...getLocaleInfo("en"),
	lang: "en"
};
/**
* Processes the Astro and Starlight i18n configurations to generate/update them accordingly:
*
* 	- If no Astro and Starlight i18n configurations are provided, the built-in default locale is
* used in Starlight and the generated Astro i18n configuration will match it.
* 	- If only a Starlight i18n configuration is provided, an equivalent Astro i18n configuration is
* generated.
* 	- If only an Astro i18n configuration is provided, an equivalent Starlight i18n configuration is
* used.
* 	- If both an Astro and Starlight i18n configurations are provided, an error is thrown.
*/
function processI18nConfig(starlightConfig, astroI18nConfig) {
	if (astroI18nConfig && !starlightConfig.isUsingBuiltInDefaultLocale) throw new AstroError("Cannot provide both an Astro `i18n` configuration and a Starlight `locales` configuration.", "Remove one of the two configurations.\nSee more at https://starlight.astro.build/guides/i18n/");
	else if (astroI18nConfig) return {
		astroI18nConfig,
		starlightConfig: {
			...starlightConfig,
			...getStarlightI18nConfig(astroI18nConfig)
		}
	};
	return {
		astroI18nConfig: getAstroI18nConfig(starlightConfig),
		starlightConfig
	};
}
/** Generate an Astro i18n configuration based on a Starlight configuration. */
function getAstroI18nConfig(config) {
	return {
		defaultLocale: (config.defaultLocale.locale === "root" ? config.defaultLocale.lang : config.defaultLocale.locale ?? config.defaultLocale.lang) ?? BuiltInDefaultLocale.lang,
		locales: config.locales ? Object.entries(config.locales).map(([locale, localeConfig]) => {
			return {
				codes: [localeConfig?.lang ?? locale],
				path: locale === "root" ? localeConfig?.lang ?? BuiltInDefaultLocale.lang : locale
			};
		}) : [config.defaultLocale.lang],
		routing: {
			prefixDefaultLocale: config.isMultilingual && config.locales?.root === void 0 || !config.isMultilingual && config.locales !== void 0,
			redirectToDefaultLocale: false,
			fallbackType: "redirect"
		}
	};
}
/** Generate a Starlight i18n configuration based on an Astro configuration. */
function getStarlightI18nConfig(astroI18nConfig) {
	if (astroI18nConfig.routing === "manual") throw new AstroError("Starlight is not compatible with the `manual` routing option in the Astro i18n configuration.");
	const prefixDefaultLocale = astroI18nConfig.routing.prefixDefaultLocale;
	const isMultilingual = astroI18nConfig.locales.length > 1;
	const isMonolingualWithRootLocale = !isMultilingual && !prefixDefaultLocale;
	const locales = isMonolingualWithRootLocale ? void 0 : Object.fromEntries(astroI18nConfig.locales.map((locale) => [isDefaultAstroLocale(astroI18nConfig, locale) && !prefixDefaultLocale ? "root" : isAstroLocaleExtendedConfig(locale) ? locale.path : locale, inferStarlightLocaleFromAstroLocale(locale)]));
	const defaultAstroLocale = astroI18nConfig.locales.find((locale) => isDefaultAstroLocale(astroI18nConfig, locale));
	if (!defaultAstroLocale) throw new AstroError("Astro default locale not found.", "This should never happen. Please open a new issue: https://github.com/withastro/starlight/issues/new?template=---01-bug-report.yml");
	return {
		isMultilingual,
		locales,
		defaultLocale: {
			...inferStarlightLocaleFromAstroLocale(defaultAstroLocale),
			locale: isMonolingualWithRootLocale || isMultilingual && !prefixDefaultLocale ? void 0 : isAstroLocaleExtendedConfig(defaultAstroLocale) ? defaultAstroLocale.codes[0] : defaultAstroLocale
		}
	};
}
/** Infer Starlight locale information based on a locale from an Astro i18n configuration. */
function inferStarlightLocaleFromAstroLocale(astroLocale) {
	const lang = isAstroLocaleExtendedConfig(astroLocale) ? astroLocale.codes[0] : astroLocale;
	return {
		...getLocaleInfo(lang),
		lang
	};
}
/** Check if the passed locale is the default locale in an Astro i18n configuration. */
function isDefaultAstroLocale(astroI18nConfig, locale) {
	return (isAstroLocaleExtendedConfig(locale) ? locale.path : locale) === astroI18nConfig.defaultLocale;
}
/**
* Check if the passed Astro locale is using the object variant.
* @see AstroLocaleExtendedConfig
*/
function isAstroLocaleExtendedConfig(locale) {
	return typeof locale !== "string";
}
/** Returns the locale information such as a label and a direction based on a BCP-47 tag. */
function getLocaleInfo(lang) {
	try {
		const locale = new Intl.Locale(lang);
		const label = new Intl.DisplayNames(locale, { type: "language" }).of(lang);
		if (!label || lang === label) throw new Error("Label not found.");
		return {
			label: label[0]?.toLocaleUpperCase(locale) + label.slice(1),
			dir: getLocaleDir(locale)
		};
	} catch {
		throw new AstroError(`Failed to get locale information for the '${lang}' locale.`, "Make sure to provide a valid BCP-47 tags (e.g. en, ar, or zh-CN).");
	}
}
/**
* Returns the direction of the passed locale.
* @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getTextInfo
*/
function getLocaleDir(locale) {
	if ("textInfo" in locale) return locale.textInfo.direction;
	else if ("getTextInfo" in locale) return locale.getTextInfo().direction;
	return wellKnownRTL.includes(locale.language) ? "rtl" : "ltr";
}
/**
* Get the string for the passed language from a dictionary object.
*
* TODO: Make this clever. Currently a simple key look-up, but should use
* BCP-47 mapping so that e.g. `en-US` returns `en` strings, and use the
* site’s default locale as a last resort.
*
* @example
* pickLang({ en: 'Hello', fr: 'Bonjour' }, 'en'); // => 'Hello'
*/
function pickLang(dictionary, lang) {
	return dictionary[lang];
}
//#endregion
export { BuiltInDefaultLocale, pickLang, processI18nConfig };
