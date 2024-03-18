import type { ChatCompletionChunk } from "openai/resources/index.mjs";
import type { Stream } from "openai/streaming.mjs";
import { WebSocket } from "ws";

import { env } from "@seegull/env";
import { AudioData, isAudioData, wsUrl } from "@seegull/services/elevenlabs";

import type { IUseCase } from "../../interfaces/usecase.interface";
import type { PromptModel } from "../../types/user/openai.types";
import { OpenAiRepository } from "../../repositories/openai.repository";
import { server } from "../../server";

async function* textChunker(
  chunks: AsyncIterable<string>,
): AsyncIterable<string> {
  const splitters = [
    ".",
    ",",
    "?",
    "!",
    ";",
    ":",
    "—",
    "-",
    "(",
    ")",
    "[",
    "]",
    "}",
    " ",
  ];
  let buffer = "";

  for await (const text of chunks) {
    if (splitters.includes(buffer[buffer.length - 1] ?? "")) {
      yield buffer + " ";
      buffer = text;
    } else if (text.length > 0 && splitters.includes(text[0] ?? "")) {
      yield buffer + text[0] + " ";
      buffer = text.substring(1);
    } else {
      buffer += text;
    }
  }

  if (buffer) {
    yield buffer + " ";
  }
}

function textToSpeechInputStreaming(
  textIterator: AsyncIterable<string>,
  audioData?: (data: AudioData) => void,
) {
  const websocket = new WebSocket(wsUrl);

  websocket.on("open", () => {
    const streamText = async () => {
      websocket.send(
        JSON.stringify({
          text: " ",
          voice_settings: { stability: 0.5, similarity_boost: 0.8 },
          xi_api_key: env.ELEVEN_LABS_API_KEY,
        }),
      );

      for await (const text of textIterator) {
        websocket.send(JSON.stringify({ text, try_trigger_generation: true }));
      }

      websocket.send(JSON.stringify({ text: "" }));
    };

    void streamText();
  });

  websocket.on("message", (data) => {
    if (isAudioData(data)) {
      audioData && audioData(data);
    }
  });
}

export class PromptAiModelUseCase implements IUseCase<PromptModel, void> {
  private openAiRepository: OpenAiRepository;

  constructor(aiModelRepository: OpenAiRepository) {
    this.openAiRepository = aiModelRepository;
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

    textToSpeechInputStreaming(textChunker(llmTextResponseIterator), (data) => {
      console.log(data);
    });
  }
}

export const setupPromptAiModelUseCase = () => {
  const aiModelRepository = new OpenAiRepository();
  return new PromptAiModelUseCase(aiModelRepository);
};
