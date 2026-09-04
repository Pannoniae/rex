import { Badge } from "../../schemas/badge.js";
import { LinkHTMLAttributes } from "../../schemas/sidebar.js";
import { HeadConfig } from "../../schemas/head.js";
import { TocItem } from "../generateToC.js";
import { CollectionEntry, RenderResult } from "astro:content";
import { MarkdownHeading } from "astro";
//#region src/utils/routing/types.d.ts
interface LocaleData {
  /** Writing direction. */
  dir: 'ltr' | 'rtl';
  /** BCP-47 language tag. */
  lang: string;
  /** The base path at which a language is served. `undefined` for root locale slugs. */
  locale: string | undefined;
}
interface SidebarAutogenerateRouteData {
  directory: string;
}
interface SidebarManualLink {
  type: 'link';
  label: string;
  href: string;
  isCurrent: boolean;
  badge: Badge | undefined;
  attrs: LinkHTMLAttributes;
}
interface SidebarAutoLink extends SidebarManualLink {
  autogenerate: SidebarAutogenerateRouteData;
}
interface SidebarManualGroup {
  type: 'group';
  label: string;
  entries: (SidebarLink | SidebarGroup)[];
  collapsed: boolean;
  badge: Badge | undefined;
}
interface SidebarAutoGroup extends SidebarManualGroup {
  autogenerate: SidebarAutogenerateRouteData;
}
type SidebarLink = SidebarManualLink | SidebarAutoLink;
type SidebarGroup = SidebarManualGroup | SidebarAutoGroup;
type SidebarEntry = SidebarLink | SidebarGroup;
interface PaginationLinks {
  /** Link to previous page in the sidebar. */
  prev: SidebarLink | undefined;
  /** Link to next page in the sidebar. */
  next: SidebarLink | undefined;
}
type StarlightDocsCollectionEntry = CollectionEntry<'docs'>;
type StarlightDocsEntry = StarlightDocsCollectionEntry & {
  filePath: string;
};
interface Route extends LocaleData {
  /** Content collection entry for the current page. Includes frontmatter at `data`. */
  entry: StarlightDocsEntry;
  /** Locale metadata for the page content. Can be different from top-level locale values when a page is using fallback content. */
  entryMeta: LocaleData;
  /** The slug. */
  id: string;
  /** Whether this page is untranslated in the current language and using fallback content from the default locale. */
  isFallback?: boolean;
  [key: string]: unknown;
}
interface StarlightRouteData extends Route {
  /** Title of the site. */
  siteTitle: string;
  /** URL or path used as the link when clicking on the site title. */
  siteTitleHref: string;
  /** Array of Markdown headings extracted from the current page. */
  headings: MarkdownHeading[];
  /** Site navigation sidebar entries for this page. */
  sidebar: SidebarEntry[];
  /** Whether or not the sidebar should be displayed on this page. */
  hasSidebar: boolean;
  /** Links to the previous and next page in the sidebar if enabled. */
  pagination: PaginationLinks;
  /** Table of contents for this page if enabled. */
  toc: {
    minHeadingLevel: number;
    maxHeadingLevel: number;
    items: TocItem[];
  } | undefined;
  /** JS Date object representing when this page was last updated if enabled. */
  lastUpdated: Date | undefined;
  /** URL object for the address where this page can be edited if enabled. */
  editUrl: URL | undefined;
  /** An Astro component to render the current page’s content if this route is a Markdown page. */
  Content?: RenderResult['Content'];
  /** Array of tags to include in the `<head>` of the current page. */
  head: HeadConfig;
}
//#endregion
export { LocaleData, PaginationLinks, Route, SidebarAutoGroup, SidebarAutoLink, SidebarAutogenerateRouteData, SidebarEntry, SidebarGroup, SidebarLink, SidebarManualGroup, SidebarManualLink, StarlightDocsCollectionEntry, StarlightDocsEntry, StarlightRouteData };