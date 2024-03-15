import { z } from "zod";

import type { IUseCase } from "../../interfaces/usecase.interface";
import { AiModelsRepository } from "../../repositories/openai.repository";

export class PromptAiModelUseCase implements IUseCase<string, string> {
  private aiModelRepository: AiModelsRepository;

  constructor(aiModelRepository: AiModelsRepository) {
    this.aiModelRepository = aiModelRepository;
  }

  execute(prompt: string): string {
    const llmResponse = this.aiModelRepository.promptLlm(prompt);

    if (llmResponse === undefined) {
      throw new Error("No llm response");
    }

    return llmResponse;
  }
}

export const setupPromptAiModelUseCase = () => {
  const aiModelRepository = new AiModelsRepository();
  return new PromptAiModelUseCase(aiModelRepository);
};
