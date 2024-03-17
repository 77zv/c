import { z } from "zod";

import type { IUseCase } from "../../interfaces/usecase.interface";
import { OpenAiRepository } from "../../repositories/openai.repository";

export class PromptAiModelUseCase implements IUseCase<string, string> {
  private aiModelRepository: OpenAiRepository;

  constructor(aiModelRepository: OpenAiRepository) {
    this.aiModelRepository = aiModelRepository;
  }

  execute(prompt: string): string {
    // const llmResponse = this.aiModelRepository.promptLlm(prompt);

    if this.aiModelRepository.isPromptText(prompt) {


    if (llmResponse === undefined) {
      throw new Error("No llm response");
    }

    return llmResponse;
  }
}

export const setupPromptAiModelUseCase = () => {
  const aiModelRepository = new OpenAiRepository();
  return new PromptAiModelUseCase(aiModelRepository);
};
