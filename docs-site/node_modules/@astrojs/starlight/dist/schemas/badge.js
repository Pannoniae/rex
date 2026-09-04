import { z } from "astro/zod";
//#region src/schemas/badge.ts
const badgeBaseSchema = z.object({
	variant: z.enum([
		"note",
		"danger",
		"success",
		"caution",
		"tip",
		"default"
	]).default("default"),
	class: z.string().optional()
});
const badgeSchema = z.object({
	...badgeBaseSchema.shape,
	text: z.string()
});
const i18nBadgeSchema = z.object({
	...badgeBaseSchema.shape,
	text: z.union([z.string(), z.record(z.string(), z.string())])
});
const BadgeComponentSchema = z.looseObject({
	...badgeSchema.shape,
	size: z.enum([
		"small",
		"medium",
		"large"
	]).default("small")
});
const BadgeConfigSchema = () => z.union([z.string(), badgeSchema]).transform((badge) => {
	if (typeof badge === "string") return {
		variant: "default",
		text: badge
	};
	return badge;
}).optional();
const I18nBadgeConfigSchema = () => z.union([z.string(), i18nBadgeSchema]).optional();
//#endregion
export { BadgeComponentSchema, BadgeConfigSchema, I18nBadgeConfigSchema };
