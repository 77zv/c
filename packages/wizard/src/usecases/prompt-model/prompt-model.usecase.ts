import { z } from "zod";

import type { IUseCase } from "../../interfaces/usecase.interface";
import { AiModelsRepository } from "../../repositories/ai-models.repository";

export class PromptAiModelUseCase implements IUseCase<string, string> {
  private aiModelRepository: AiModelsRepository;

  constructor(aiModelRepository: AiModelsRepository) {
    this.aiModelRepository = aiModelRepository;
  }

  execute(prompt: string): string {
    const promptValidation = z.string().min(1);
    const validatedPrompt = promptValidation.parse(prompt);

    const response = this.aiModelRepository.promptLlm(validatedPrompt);

    return response;
  }
}

export const setupPromptAiModelUseCase = () => {
  const aiModelRepository = new AiModelsRepository();
  return new PromptAiModelUseCase(aiModelRepository);
};
