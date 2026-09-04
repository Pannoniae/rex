//#region src/utils/url.ts
const HTTPProtocolRegEx = /^https?:\/\//;
const ProtocolRegEx = /^[a-z][a-z\d+.-]*:/i;
/** Check if a string starts with one of `http://` or `https://`. */
const isAbsoluteUrl = (link) => HTTPProtocolRegEx.test(link);
/** Check if a string contains a protocol (e.g., `http:`, `https:`, `mailto:`). */
const hasProtocol = (link) => ProtocolRegEx.test(link);
//#endregion
export { hasProtocol, isAbsoluteUrl };
