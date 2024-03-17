export interface PromptText {
  text: string;
}

export interface PromptImages {
  imageUrls: string[];
}

export type PromptTextAndImages = PromptText & PromptImages;
export type PromptModel = PromptText | PromptImages | PromptTextAndImages;
