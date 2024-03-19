import { z } from "zod";

export interface PromptText {
  text: string;
}

export interface PromptImages {
  imageUrls: string[];
}

export type PromptTextAndImages = PromptText & PromptImages;
export type PromptModel = PromptText | PromptImages | PromptTextAndImages;

const PromptTextSchema = z.object({
  text: z.string(),
});

const PromptImagesSchema = z.object({
  imageUrls: z.array(z.string().url()), // Assuming these should be valid URLs
});

const PromptTextAndImagesSchema = PromptTextSchema.merge(PromptImagesSchema);

const PromptModelSchema = z.union([
  PromptTextSchema,
  PromptImagesSchema,
  PromptTextAndImagesSchema,
]);

export {
  PromptTextSchema,
  PromptImagesSchema,
  PromptTextAndImagesSchema,
  PromptModelSchema,
};
