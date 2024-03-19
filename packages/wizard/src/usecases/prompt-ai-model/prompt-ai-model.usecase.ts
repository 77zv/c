import TextStreamProcessor from "@seegull/utils/text-stream-processor";

import type { IUseCase } from "../../interfaces/usecase.interface";
import type { AudioData } from "../../types/user/elevenlabs.types";
import type { PromptModel } from "../../types/user/openai.types";
import { ElevenLabsRepository } from "../../repositories/elevenlabs.repository";
import { OpenAiRepository } from "../../repositories/openai.repository";
import { websocketClients } from "../../server";

interface PromptAiModelProps {
  promptData: PromptModel;
  clientId: string;
}

export class PromptAiModelUseCase
  implements IUseCase<PromptAiModelProps, void>
{
  private openAiRepository: OpenAiRepository;
  private elevenLabsRepository: ElevenLabsRepository;

  constructor(
    aiModelRepository: OpenAiRepository,
    elevenLabsRepository: ElevenLabsRepository,
  ) {
    this.openAiRepository = aiModelRepository;
    this.elevenLabsRepository = elevenLabsRepository;
  }

  async execute({ promptData, clientId }: PromptAiModelProps): Promise<void> {
    let llmTextResponseIterator: AsyncIterable<string> | undefined;

    try {
      if (this.openAiRepository.isPromptText(promptData)) {
        llmTextResponseIterator =
          await this.openAiRepository.promptLlmText(promptData);
      } else if (this.openAiRepository.isPromptImages(promptData)) {
        llmTextResponseIterator =
          await this.openAiRepository.promptLlmImages(promptData);
      } else if (this.openAiRepository.isPromptTextAndImages(promptData)) {
        llmTextResponseIterator =
          await this.openAiRepository.promptLlmTextAndImages(promptData);
      }

      if (llmTextResponseIterator === undefined) {
        throw new Error("LLM Text Response Iterator is undefined");
      }
    } catch (err) {
      throw new Error("Error with llm response");
    }

    const textChunker = TextStreamProcessor.textChunker(
      llmTextResponseIterator,
    );

    this.elevenLabsRepository.textToSpeech(textChunker, (data: AudioData) => {
      const connection = websocketClients.get(clientId);

      if (connection?.socket.OPEN) {
        connection.socket.send(JSON.stringify(data));
      }

      console.log(data);
    });
  }
}

export const setupPromptAiModelUseCase = () => {
  const aiModelRepository = new OpenAiRepository();
  const elevenLabsRepository = new ElevenLabsRepository();

  return new PromptAiModelUseCase(aiModelRepository, elevenLabsRepository);
};
