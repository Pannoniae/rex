import { createPathFormatter } from "./createPathFormatter.js";
import project from "virtual:starlight/project-context";
//#region src/utils/format-path.ts
const formatPath = createPathFormatter({
	format: project.build.format,
	trailingSlash: project.trailingSlash
});
//#endregion
export { formatPath };
