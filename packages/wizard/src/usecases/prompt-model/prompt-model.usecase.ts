import { ChatCompletionChunk } from "openai/resources/index.mjs";
import { Stream } from "openai/streaming.mjs";
import { z } from "zod";

import type { IUseCase } from "../../interfaces/usecase.interface";
import { OpenAiRepository } from "../../repositories/openai.repository";
import { PromptModel } from "../../types/user/openai.types";

export class PromptAiModelUseCase
  implements IUseCase<PromptModel, Stream<ChatCompletionChunk>>
{
  private aiModelRepository: OpenAiRepository;

  constructor(aiModelRepository: OpenAiRepository) {
    this.aiModelRepository = aiModelRepository;
  }

  async execute(input: PromptModel): Promise<Stream<ChatCompletionChunk>> {
    let llmResponse: Stream<ChatCompletionChunk> | undefined;

    try {
      if (this.aiModelRepository.isPromptText(input)) {
        llmResponse = await this.aiModelRepository.promptLlmText(input);
      } else if (this.aiModelRepository.isPromptImages(input)) {
        llmResponse = await this.aiModelRepository.promptLlmImages(input);
      } else if (this.aiModelRepository.isPromptTextAndImages(input)) {
        llmResponse =
          await this.aiModelRepository.promptLlmTextAndImages(input);
      }

      if (llmResponse === undefined) {
        throw new Error("Error with llm response");
      }
    } catch (error) {
      throw new Error("Error with llm response");
    }

    return llmResponse;
  }
}

export const setupPromptAiModelUseCase = () => {
  const aiModelRepository = new OpenAiRepository();
  return new PromptAiModelUseCase(aiModelRepository);
};
