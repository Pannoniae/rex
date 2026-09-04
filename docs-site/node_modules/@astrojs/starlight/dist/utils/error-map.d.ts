import { z } from "astro/zod";
//#region src/utils/error-map.d.ts
/**
 * Parse data with a Zod schema and throw a nicely formatted error if it is invalid.
 *
 * @param schema The Zod schema to use to parse the input.
 * @param input Input data that should match the schema.
 * @param message Error message preamble to use if the input fails to parse.
 * @returns Validated data parsed by Zod.
 */
declare function parseWithFriendlyErrors<T extends z.ZodType>(schema: T, input: z.input<T>, message: string): z.output<T>;
/**
 * Asynchronously parse data with a Zod schema that contains asynchronous refinements or transforms
 * and throw a nicely formatted error if it is invalid.
 *
 * @param schema The Zod schema to use to parse the input.
 * @param input Input data that should match the schema.
 * @param message Error message preamble to use if the input fails to parse.
 * @returns Validated data parsed by Zod.
 */
declare function parseAsyncWithFriendlyErrors<T extends z.ZodType>(schema: T, input: z.input<T>, message: string): Promise<z.output<T>>;
//#endregion
export { parseAsyncWithFriendlyErrors, parseWithFriendlyErrors };