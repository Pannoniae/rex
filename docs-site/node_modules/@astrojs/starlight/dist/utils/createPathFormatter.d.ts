import { AstroConfig } from "astro";
//#region src/utils/createPathFormatter.d.ts
interface FormatPathOptions {
  format?: AstroConfig['build']['format'];
  trailingSlash?: AstroConfig['trailingSlash'];
}
declare function createPathFormatter(opts: FormatPathOptions): (href: string) => string;
//#endregion
export { createPathFormatter };