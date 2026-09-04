import { AstroError } from "astro/errors";
import { locales } from "astro/zod";
//#region src/utils/error-map.ts
/**
* This is a modified version of Astro's error map.
* source: https://github.com/withastro/astro/blob/main/packages/astro/src/content/error-map.ts
*/
const zodErrorMap = locales.en().localeError;
/**
* Parse data with a Zod schema and throw a nicely formatted error if it is invalid.
*
* @param schema The Zod schema to use to parse the input.
* @param input Input data that should match the schema.
* @param message Error message preamble to use if the input fails to parse.
* @returns Validated data parsed by Zod.
*/
function parseWithFriendlyErrors(schema, input, message) {
	return processParsedData(schema.safeParse(input, {
		error: errorMap,
		reportInput: true
	}), message);
}
/**
* Asynchronously parse data with a Zod schema that contains asynchronous refinements or transforms
* and throw a nicely formatted error if it is invalid.
*
* @param schema The Zod schema to use to parse the input.
* @param input Input data that should match the schema.
* @param message Error message preamble to use if the input fails to parse.
* @returns Validated data parsed by Zod.
*/
async function parseAsyncWithFriendlyErrors(schema, input, message) {
	return processParsedData(await schema.safeParseAsync(input, {
		error: errorMap,
		reportInput: true
	}), message);
}
function processParsedData(parsedData, message) {
	if (!parsedData.success) throw new AstroError(message, parsedData.error.issues.map((i) => i.message).join("\n"));
	return parsedData.data;
}
const errorMap = (issue) => {
	const baseErrorPath = flattenErrorPath(issue.path ?? []);
	if (issue.code === "invalid_union") {
		const unionErrors = issue.errors.flat();
		const typeOrLiteralErrByPath = /* @__PURE__ */ new Map();
		for (const unionError of unionErrors) if (unionError.code === "invalid_type") {
			const flattenedErrorPath = flattenErrorPath([baseErrorPath, ...unionError.path]);
			if (typeOrLiteralErrByPath.has(flattenedErrorPath)) typeOrLiteralErrByPath.get(flattenedErrorPath).expected.push(unionError.expected);
			else typeOrLiteralErrByPath.set(flattenedErrorPath, {
				code: unionError.code,
				received: parsedType(issue.input),
				expected: [unionError.expected],
				message: unionError.message
			});
		}
		const messages = [prefix(baseErrorPath, "Did not match union.")];
		const details = [...typeOrLiteralErrByPath.entries()].filter(([, error]) => error.expected.length === unionErrors.length).map(([key, error]) => key === baseErrorPath ? `> ${getTypeErrMsg(error)}` : `> ${prefix(key, getTypeErrMsg(error))}`);
		if (details.length === 0) {
			const expectedShapes = [];
			for (const unionError of issue.errors) {
				const expectedShape = [];
				for (const issue of unionError) {
					if (issue.code === "invalid_type" && issue.expected === "never") continue;
					if (issue.code === "invalid_union") return errorMap({
						...issue,
						input: issue.input,
						path: [baseErrorPath, ...issue.path]
					});
					const relativePath = flattenErrorPath(issue.path).replace(baseErrorPath, "").replace(leadingPeriod, "");
					if (issue.code === "invalid_type") expectedShape.push(relativePath ? `${relativePath}: ${issue.expected}` : issue.expected);
					else if (issue.code === "custom") expectedShape.push(relativePath);
				}
				if (expectedShape.length === 1 && !expectedShape[0]?.includes(":")) expectedShapes.push(expectedShape.join(""));
				else if (expectedShape.length > 0) expectedShapes.push(`{ ${expectedShape.join("; ")} }`);
			}
			if (expectedShapes.length) {
				details.push("> Expected type `" + expectedShapes.join(" | ") + "`");
				details.push("> Received `" + stringify(issue.input) + "`");
			}
		}
		return messages.concat(details).join("\n");
	} else if (issue.code === "invalid_type") return prefix(baseErrorPath, getTypeErrMsg({
		code: issue.code,
		received: parsedType(issue.input),
		expected: [issue.expected],
		message: issue.message
	}));
	else if (issue.message) return prefix(baseErrorPath, issue.message);
	else {
		const defaultError = zodErrorMap(issue);
		if (!defaultError) return;
		return prefix(baseErrorPath, typeof defaultError === "string" ? defaultError : defaultError.message);
	}
};
const getTypeErrMsg = (error) => {
	if (typeof error.received === "undefined" || error.received === "undefined") return error.message ?? "Required";
	const expectedDeduped = new Set(error.expected);
	return `Expected type \`${unionExpectedVals(expectedDeduped)}\`, received \`${stringify(error.received)}\``;
};
const prefix = (key, msg) => key.length ? `**${key}**: ${msg}` : msg;
const unionExpectedVals = (expectedVals) => [...expectedVals].map((expectedVal) => stringify(expectedVal)).join(" | ");
const flattenErrorPath = (errorPath) => errorPath.join(".");
/** `JSON.stringify()` a value with spaces around object/array entries. */
const stringify = (val) => JSON.stringify(val, null, 1).split(newlinePlusWhitespace).join(" ");
const newlinePlusWhitespace = /\n\s*/;
const leadingPeriod = /^\./;
/**
* In Zod 4, we don't necessarily get a human-readable representation of input data types. For such
* cases, we use the same logic as Zod's own `parsedType()` function.
* @see https://github.com/colinhacks/zod/blob/73b071d7d08825dedb6b48b78718739118ee1308/packages/zod/src/v4/locales/en.ts#L5
*/
const parsedType = (data) => {
	const t = typeof data;
	switch (t) {
		case "number": return Number.isNaN(data) ? "NaN" : "number";
		case "object":
			if (Array.isArray(data)) return "array";
			if (data === null) return "null";
			if (data && Object.getPrototypeOf(data) !== Object.prototype && data.constructor) return data.constructor.name;
	}
	return t;
};
//#endregion
export { parseAsyncWithFriendlyErrors, parseWithFriendlyErrors };
