const COLLECTOR_KEY = /* @__PURE__ */ Symbol.for("astro:incremental-content-entries");
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
function beginContentEntryCollection() {
  collector().current = /* @__PURE__ */ new Set();
}
function recordContentEntryRender(filePath) {
  if (!filePath) return;
  collector().current?.add(filePath);
}
function endContentEntryCollection() {
  const c = collector();
  const entries = c.current;
  c.current = void 0;
  return entries ? [...entries] : void 0;
}
export {
  beginContentEntryCollection,
  endContentEntryCollection,
  recordContentEntryRender
};
