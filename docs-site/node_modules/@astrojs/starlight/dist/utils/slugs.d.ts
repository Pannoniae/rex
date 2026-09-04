import { LocaleData } from "./routing/types.js";
//#region src/utils/slugs.d.ts
/** Get locale information for a given slug. */
declare function slugToLocaleData(slug: string): LocaleData;
/**
 * Get the BCP-47 language tag for the given locale.
 * @param locale Locale string or `undefined` for the root locale.
 */
declare function localeToLang(locale: string | undefined): string;
/**
 * Convert a content collection slug to a param as expected by Astro’s router.
 * This utility handles stripping `index` from file names and matches
 * [Astro’s param sanitization logic](https://github.com/withastro/astro/blob/687d25365a41ff8a9e6da155d3527f841abb70dd/packages/astro/src/core/routing/manifest/generator.ts#L4-L18)
 * by normalizing strings to their canonical representations.
 * @param slug Content collection slug
 * @returns Param compatible with Astro’s router
 */
declare function slugToParam(slug: string): string | undefined;
declare function slugToPathname(slug: string): string;
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
declare function localizedSlug(slug: string, locale: string | undefined): string;
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
declare function localizedFilePath(filePath: string, locale: string | undefined): string;
/** Extract the slug from a URL. */
declare function urlToSlug(url: URL): string;
//#endregion
export { localeToLang, localizedFilePath, localizedSlug, slugToLocaleData, slugToParam, slugToPathname, urlToSlug };