import { stripTrailingSlash } from "./path.js";
import { BuiltInDefaultLocale } from "./i18n.js";
import { slugToLocale as slugToLocale$1 } from "../integrations/shared/slugToLocale.js";
import config from "virtual:starlight/user-config";
//#region src/utils/slugs.ts
/**
* Get the “locale” of a slug. This is the base path at which a language is served.
* For example, if French docs are in `src/content/docs/french/`, the locale is `french`.
* Root locale slugs will return `undefined`.
* @param slug A collection entry slug
*/
function slugToLocale(slug) {
	return slugToLocale$1(slug, config);
}
/** Get locale information for a given slug. */
function slugToLocaleData(slug) {
	const locale = slugToLocale(slug);
	return {
		dir: localeToDir(locale),
		lang: localeToLang(locale),
		locale
	};
}
/**
* Get the BCP-47 language tag for the given locale.
* @param locale Locale string or `undefined` for the root locale.
*/
function localeToLang(locale) {
	const lang = locale ? config.locales?.[locale]?.lang : config.locales?.root?.lang;
	const defaultLang = config.defaultLocale?.lang || config.defaultLocale?.locale;
	return lang || defaultLang || BuiltInDefaultLocale.lang;
}
/**
* Get the configured writing direction for the given locale.
* @param locale Locale string or `undefined` for the root locale.
*/
function localeToDir(locale) {
	return (locale ? config.locales?.[locale]?.dir : config.locales?.root?.dir) || config.defaultLocale.dir;
}
/**
* Convert a content collection slug to a param as expected by Astro’s router.
* This utility handles stripping `index` from file names and matches
* [Astro’s param sanitization logic](https://github.com/withastro/astro/blob/687d25365a41ff8a9e6da155d3527f841abb70dd/packages/astro/src/core/routing/manifest/generator.ts#L4-L18)
* by normalizing strings to their canonical representations.
* @param slug Content collection slug
* @returns Param compatible with Astro’s router
*/
function slugToParam(slug) {
	return slug === "index" || slug === "" || slug === "/" ? void 0 : (slug.endsWith("/index") ? slug.slice(0, -6) : slug).normalize();
}
function slugToPathname(slug) {
	const param = slugToParam(slug);
	return param ? "/" + param + "/" : "/";
}
/**
* Convert a slug to a different locale.
* For example, passing a slug of `en/home` and a locale of `fr` results in `fr/home`.
* An undefined locale is treated as the root locale, resulting in `home`
* @param slug A collection entry slug
* @param locale The target locale
* @example
* localizedSlug('en/home', 'fr')       // => 'fr/home'
* localizedSlug('en/home', undefined)  // => 'home'
*/
function localizedSlug(slug, locale) {
	const slugLocale = slugToLocale(slug);
	if (slugLocale === locale) return slug;
	locale = locale || "";
	if (slugLocale === slug) return locale;
	if (slugLocale) return stripTrailingSlash(slug.replace(slugLocale + "/", locale ? locale + "/" : ""));
	return slug ? locale + "/" + slug : locale;
}
/**
* Convert a file path relative to the collection root to a different locale.
* For example, passing a file path of `en/home.md` and a locale of `fr` results in `fr/home.md`.
* An undefined locale is treated as the root locale, resulting in `home.md`.
* @param filePath A collection entry file path relative to the collection root
* @param locale The target locale
* @example
* localizedFilePath('en/home.md', 'fr')       // => 'fr/home.md'
* localizedFilePath('en/home.md', undefined)  // => 'home.md'
*/
function localizedFilePath(filePath, locale) {
	const filePathLocale = slugToLocale(filePath);
	if (filePathLocale) return filePath.replace(filePathLocale + "/", locale ? locale + "/" : "");
	else if (locale) return locale + "/" + filePath;
	else return filePath;
}
/** Extract the slug from a URL. */
function urlToSlug(url) {
	let pathname = url.pathname;
	const base = stripTrailingSlash(import.meta.env.BASE_URL);
	if (pathname.startsWith(base)) pathname = pathname.replace(base, "");
	const segments = pathname.split("/");
	const htmlExt = ".html";
	if (segments.at(-1) === "index.html") segments.pop();
	else if (segments.at(-1)?.endsWith(htmlExt)) {
		const last = segments.pop();
		if (last) segments.push(last.slice(0, -5));
	}
	return segments.filter(Boolean).join("/");
}
//#endregion
export { localeToLang, localizedFilePath, localizedSlug, slugToLocaleData, slugToParam, slugToPathname, urlToSlug };
