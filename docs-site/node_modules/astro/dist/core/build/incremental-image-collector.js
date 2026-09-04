const COLLECTOR_KEY = /* @__PURE__ */ Symbol.for("astro:incremental-static-images");
function collector() {
  const host = globalThis;
  let value = host[COLLECTOR_KEY];
  if (!value) {
    value = { current: void 0 };
    Object.defineProperty(host, COLLECTOR_KEY, {
      value,
      configurable: false,
      writable: false,
      enumerable: false
    });
  }
  return value;
}
function beginImageCollection() {
  collector().current = [];
}
function recordStaticImage(image) {
  collector().current?.push(image);
}
function endImageCollection() {
  const c = collector();
  const images = c.current;
  c.current = void 0;
  return images;
}
export {
  beginImageCollection,
  endImageCollection,
  recordStaticImage
};
