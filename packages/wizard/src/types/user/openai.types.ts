import { z } from "zod";

export interface PromptText {
  text: string;
}

export interface PromptImages {
  imageUrls: string[];
}

export type PromptTextAndImages = PromptText & PromptImages;
export type PromptModel = PromptText | PromptImages | PromptTextAndImages;

// Define Zod schema for PromptText
const PromptTextSchema = z.object({
  text: z.string(),
});

// Define Zod schema for PromptImages
const PromptImagesSchema = z.object({
  imageUrls: z.array(z.string().url()), // Assuming these should be valid URLs
});

// Define Zod schema for PromptTextAndImages by combining PromptText and PromptImages
// Since TypeScript's '&' operator corresponds to Zod's '.merge()' method
const PromptTextAndImagesSchema = PromptTextSchema.merge(PromptImagesSchema);

// Define Zod schema for PromptModel by creating a union of the three types
const PromptModelSchema = z.union([
  PromptTextSchema,
  PromptImagesSchema,
  PromptTextAndImagesSchema,
]);

// Export the schemas if needed
export {
  PromptTextSchema,
  PromptImagesSchema,
  PromptTextAndImagesSchema,
  PromptModelSchema,
};
