import { Route, StarlightDocsCollectionEntry, StarlightDocsEntry } from "./types.js";
import { GetStaticPathsItem } from "astro";
//#region src/utils/routing/index.d.ts
interface Path extends GetStaticPathsItem {
  params: {
    slug: string | undefined;
  };
}
/** Normalize a collection entry. */
declare function normalizeCollectionEntry(entry: StarlightDocsCollectionEntry): StarlightDocsEntry;
declare const routes: Route[];
declare function getRouteById(id: string): Route | undefined;
declare function getRouteBySlugParam(slugParam: string | undefined): Route | undefined;
declare const paths: Path[];
/**
 * Get all routes for a specific locale.
 * A locale of `undefined` is treated as the “root” locale, if configured.
 */
declare function getLocaleRoutes(locale: string | undefined): Route[];
//#endregion
export { getLocaleRoutes, getRouteById, getRouteBySlugParam, normalizeCollectionEntry, paths, routes };