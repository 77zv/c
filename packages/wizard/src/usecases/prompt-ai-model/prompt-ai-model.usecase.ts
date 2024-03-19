import { WebSocket } from "ws";

import type { AudioData } from "@seegull/services/elevenlabs";
import { env } from "@seegull/env";
import { isAudioData, wsUrl } from "@seegull/services/elevenlabs";
import TextStreamProcessor from "@seegull/utils/text-stream-processor";

import type { IUseCase } from "../../interfaces/usecase.interface";
import type { PromptModel } from "../../types/user/openai.types";
import { ElevenLabsRepository } from "../../repositories/elevenlabs.repository";
import { OpenAiRepository } from "../../repositories/openai.repository";

export class PromptAiModelUseCase implements IUseCase<PromptModel, void> {
  private openAiRepository: OpenAiRepository;
  private elevenLabsRepository: ElevenLabsRepository;

  constructor(
    aiModelRepository: OpenAiRepository,
    elevenLabsRepository: ElevenLabsRepository,
  ) {
    this.openAiRepository = aiModelRepository;
    this.elevenLabsRepository = elevenLabsRepository;
  }

  async execute(input: PromptModel): Promise<void> {
    let llmTextResponseIterator: AsyncIterable<string> | undefined;

    try {
      if (this.openAiRepository.isPromptText(input)) {
        llmTextResponseIterator =
          await this.openAiRepository.promptLlmText(input);
      } else if (this.openAiRepository.isPromptImages(input)) {
        llmTextResponseIterator =
          await this.openAiRepository.promptLlmImages(input);
      } else if (this.openAiRepository.isPromptTextAndImages(input)) {
        llmTextResponseIterator =
          await this.openAiRepository.promptLlmTextAndImages(input);
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
      console.log(data);
    });
  }
}

export const setupPromptAiModelUseCase = () => {
  const aiModelRepository = new OpenAiRepository();
  const elevenLabsRepository = new ElevenLabsRepository();

  return new PromptAiModelUseCase(aiModelRepository, elevenLabsRepository);
};
