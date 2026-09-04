import { StarlightConfig } from "../../utils/user-config.js";
import "../../types.js";
//#region src/integrations/shared/slugToLocale.d.ts
/**
 * Get the “locale” of a slug. This is the base path at which a language is served.
 * For example, if French docs are in `src/content/docs/french/`, the locale is `french`.
 * Root locale slugs will return `undefined`.
 * @param slug A collection entry slug
 */
declare function slugToLocale(slug: string | undefined, config: Pick<StarlightConfig, 'defaultLocale' | 'locales'>): string | undefined;
//#endregion
export { slugToLocale };