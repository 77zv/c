import { z } from "zod";

import { User } from "../../models/user/user.model";
import { AiModelsRepository } from "../../repositories/ai-models.repository";
import { UserRepository } from "../../repositories/user.repository";

export class PromptAiModelUseCase {
  private aiModelRepository: AiModelsRepository;

  constructor(aiModelRepository: AiModelsRepository) {
    this.aiModelRepository = aiModelRepository;
  }

  execute(prompt: string) {
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
