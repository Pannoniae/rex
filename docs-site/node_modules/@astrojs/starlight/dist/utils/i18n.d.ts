import { StarlightConfig } from "./user-config.js";
import { AstroConfig } from "astro";
//#region src/utils/i18n.d.ts
/** Information about the built-in default locale used as a fallback when no locales are defined. */
declare const BuiltInDefaultLocale: {
  lang: string;
  label: string;
  dir: "rtl" | "ltr";
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
declare function processI18nConfig(starlightConfig: StarlightConfig, astroI18nConfig: AstroConfig['i18n']): {
  astroI18nConfig: {
    defaultLocale: string;
    locales: (string | {
      path: string;
      codes: [string, ...string[]];
    })[];
    routing: "manual" | {
      prefixDefaultLocale: boolean;
      redirectToDefaultLocale: boolean;
      fallbackType: "redirect" | "rewrite";
    };
    domains?: Record<string, string> | undefined;
    fallback?: Record<string, string> | undefined;
  };
  starlightConfig: StarlightConfig;
};
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
declare function pickLang<T extends Record<string, string>>(dictionary: T, lang: keyof T): string | undefined;
//#endregion
export { BuiltInDefaultLocale, pickLang, processI18nConfig };