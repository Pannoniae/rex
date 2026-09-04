import { parseFrontmatter } from "@astrojs/internal-helpers/frontmatter";
function appendForwardSlash(path) {
  return path.endsWith("/") ? path : path + "/";
}
function getFileInfo(id, config) {
  const sitePathname = appendForwardSlash(
    config.site ? new URL(config.base, config.site).pathname : config.base
  );
  let url = void 0;
  try {
    url = new URL(`file://${id}`);
  } catch {
  }
  const fileId = id.split("?")[0];
  let fileUrl;
  const isPage = fileId.includes("/pages/");
  if (isPage) {
    fileUrl = fileId.replace(/^.*?\/pages\//, sitePathname).replace(/(?:\/index)?\.mdx$/, "");
  } else if (url?.pathname.startsWith(config.root.pathname)) {
    fileUrl = url.pathname.slice(config.root.pathname.length);
  } else {
    fileUrl = fileId;
  }
  if (fileUrl && config.trailingSlash === "always") {
    fileUrl = appendForwardSlash(fileUrl);
  }
  return { fileId, fileUrl };
}
function safeParseFrontmatter(code, id) {
  try {
    return parseFrontmatter(code, { frontmatter: "empty-with-spaces" });
  } catch (e) {
    if (e.name === "YAMLException") {
      const err = e;
      err.id = id;
      err.loc = { file: e.id, line: e.mark.line + 1, column: e.mark.column };
      err.message = e.reason;
      throw err;
    } else {
      throw e;
    }
  }
}
export {
  appendForwardSlash,
  getFileInfo,
  safeParseFrontmatter
};
