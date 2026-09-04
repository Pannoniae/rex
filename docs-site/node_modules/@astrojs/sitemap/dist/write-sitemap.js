import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { normalize, resolve } from "node:path";
import { pipeline, Readable } from "node:stream";
import { promisify } from "node:util";
import { SitemapAndIndexStream, SitemapIndexStream, SitemapStream } from "sitemap";
import { getLatestLastmod } from "./utils/lastmod.js";
async function writeSitemap({
  filenameBase,
  hostname,
  sitemapHostname = hostname,
  sourceData,
  destinationDir,
  limit = 5e4,
  customSitemaps = [],
  publicBasePath = "./",
  xslURL: xslUrl,
  lastmod,
  namespaces = { news: true, xhtml: true, image: true, video: true }
}) {
  await mkdir(destinationDir, { recursive: true });
  const sitemapAndIndexStream = new SitemapAndIndexStream({
    limit,
    xslUrl,
    getSitemapStream: (i) => {
      const sitemapStream = new SitemapStream({
        hostname,
        xslUrl,
        // Custom namespace handling
        xmlns: {
          news: namespaces?.news !== false,
          xhtml: namespaces?.xhtml !== false,
          image: namespaces?.image !== false,
          video: namespaces?.video !== false
        }
      });
      const path = `./${filenameBase}-${i}.xml`;
      const writePath = resolve(destinationDir, path);
      if (!publicBasePath.endsWith("/")) {
        publicBasePath += "/";
      }
      const publicPath = normalize(publicBasePath + path);
      const stream = sitemapStream.pipe(createWriteStream(writePath));
      const url = new URL(publicPath, sitemapHostname).toString();
      const fileLastmod = getLatestLastmod(sourceData.slice(i * limit, (i + 1) * limit)) ?? lastmod;
      return [{ url, lastmod: fileLastmod }, sitemapStream, stream];
    }
  });
  const src = Readable.from(sourceData);
  const indexPath = resolve(destinationDir, `./${filenameBase}-index.xml`);
  for (const url of customSitemaps) {
    SitemapIndexStream.prototype._transform.call(
      sitemapAndIndexStream,
      { url, lastmod },
      "utf8",
      () => {
      }
    );
  }
  return promisify(pipeline)(src, sitemapAndIndexStream, createWriteStream(indexPath));
}
export {
  writeSitemap
};
