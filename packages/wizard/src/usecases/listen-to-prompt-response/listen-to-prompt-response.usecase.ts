import { ChatCompletionChunk } from "openai/resources/index.mjs";
import { Stream } from "openai/streaming.mjs";
import { z } from "zod";

import type { IUseCase } from "../../interfaces/usecase.interface";
import { OpenAiRepository } from "../../repositories/openai.repository";
import { PromptModel } from "../../types/user/openai.types";

export class ListenToPromptResponseUseCase
  implements IUseCase<PromptModel, Stream<ChatCompletionChunk>>
{
  // private aiModelRepository: OpenAiRepository;

  constructor(aiModelRepository: OpenAiRepository) {
    // this.aiModelRepository = aiModelRepository;
  }

  async execute(input: PromptModel): Promise<Stream<ChatCompletionChunk>> {
    let llmResponse: Stream<ChatCompletionChunk> | undefined;

    return llmResponse;
  }
}

export const setupPromptAiModelUseCase = () => {
  const aiModelRepository = new OpenAiRepository();
  return new ListenToPromptResponseUseCase(aiModelRepository);
};
