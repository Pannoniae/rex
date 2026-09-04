import { BuiltInDefaultLocale } from "../i18n.js";
import { localizedSlug, slugToLocaleData, slugToParam } from "../slugs.js";
import { validateLogoImports } from "../validateLogoImports.js";
import { getCollection } from "astro:content";
import config from "virtual:starlight/user-config";
//#region src/utils/routing/index.ts
validateLogoImports();
/**
* Astro is inconsistent in its `index.md` slug generation. In most cases,
* `index` is stripped, but in the root of a collection, we get a slug of `index`.
* We map that to an empty string for consistent behaviour.
*/
const normalizeIndexSlug = (slug) => slug === "index" ? "" : slug;
/** Normalize a collection entry. */
function normalizeCollectionEntry(entry) {
	return {
		...entry,
		id: normalizeIndexSlug(entry.id),
		filePath: entry.filePath
	};
}
/** All entries in the docs content collection. */
const docs = (await getCollection("docs", ({ data }) => {
	return import.meta.env.MODE !== "production" || data.draft === false;
}) ?? []).map(normalizeCollectionEntry);
function getRoutes() {
	const routes = docs.map((entry) => ({
		entry,
		id: entry.id,
		entryMeta: slugToLocaleData(entry.id),
		...slugToLocaleData(entry.id)
	}));
	if (config.isMultilingual) {
		/** Entries in the docs content collection for the default locale. */
		const defaultLocaleDocs = getLocaleDocs(config.defaultLocale?.locale === "root" ? void 0 : config.defaultLocale?.locale);
		for (const key in config.locales) {
			if (key === config.defaultLocale.locale) continue;
			const localeConfig = config.locales[key];
			if (!localeConfig) continue;
			const locale = key === "root" ? void 0 : key;
			const localeDocs = getLocaleDocs(locale);
			const localeDocIds = new Set(localeDocs.map(({ id }) => id));
			for (const fallback of defaultLocaleDocs) {
				const id = localizedSlug(fallback.id, locale);
				if (localeDocIds.has(id)) continue;
				routes.push({
					entry: fallback,
					id,
					isFallback: true,
					lang: localeConfig.lang || BuiltInDefaultLocale.lang,
					locale,
					dir: localeConfig.dir,
					entryMeta: slugToLocaleData(fallback.id)
				});
			}
		}
	}
	return routes;
}
const routes = getRoutes();
const routesById = new Map(routes.map((route) => [route.id, route]));
function getRouteById(id) {
	return routesById.get(id);
}
function getParamRouteMapping() {
	const map = /* @__PURE__ */ new Map();
	for (const route of routes) map.set(slugToParam(route.id), route);
	return map;
}
const routesBySlugParam = getParamRouteMapping();
function getRouteBySlugParam(slugParam) {
	return routesBySlugParam.get(slugParam?.replace(/\/$/, "") || void 0);
}
function getPaths() {
	return routes.map((route) => ({ params: { slug: slugToParam(route.id) } }));
}
const paths = getPaths();
/**
* Get all routes for a specific locale.
* A locale of `undefined` is treated as the “root” locale, if configured.
*/
function getLocaleRoutes(locale) {
	return filterByLocale(routes, locale);
}
/**
* Get all entries in the docs content collection for a specific locale.
* A locale of `undefined` is treated as the “root” locale, if configured.
*/
function getLocaleDocs(locale) {
	return filterByLocale(docs, locale);
}
/** Filter an array to find items whose slug matches the passed locale. */
function filterByLocale(items, locale) {
	if (config.locales) {
		if (locale && locale in config.locales) return items.filter((i) => i.id === locale || i.id.startsWith(locale + "/"));
		else if (config.locales.root) {
			const langKeys = Object.keys(config.locales).filter((k) => k !== "root");
			const isLangIndex = new RegExp(`^(${langKeys.join("|")})$`);
			const isLangDir = new RegExp(`^(${langKeys.join("|")})/`);
			return items.filter((i) => !isLangIndex.test(i.id) && !isLangDir.test(i.id));
		}
	}
	return items;
}
//#endregion
export { getLocaleRoutes, getRouteById, getRouteBySlugParam, normalizeCollectionEntry, paths, routes };
