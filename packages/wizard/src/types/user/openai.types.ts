import { z } from "zod";

const PromptTextSchema = z.object({
  text: z.string(),
});

const PromptImagesSchema = z.object({
  imageUrls: z.array(z.string().url()),
});

const PromptTextAndImagesSchema = PromptTextSchema.merge(PromptImagesSchema);

const PromptModelSchema = z.union([
  PromptTextSchema,
  PromptImagesSchema,
  PromptTextAndImagesSchema,
]);

type PromptText = z.infer<typeof PromptTextSchema>;
type PromptImages = z.infer<typeof PromptImagesSchema>;
type PromptTextAndImages = z.infer<typeof PromptTextAndImagesSchema>;
type PromptModel = z.infer<typeof PromptModelSchema>;

export {
  PromptTextSchema,
  PromptImagesSchema,
  PromptTextAndImagesSchema,
  PromptModelSchema,
};
export type { PromptText, PromptImages, PromptTextAndImages, PromptModel };
