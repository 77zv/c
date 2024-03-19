import WebSocket from "ws";

import { env } from "@seegull/env";
import { wsUrl } from "@seegull/services/elevenlabs";

import type { AudioData } from "../types/user/elevenlabs.types";

export class ElevenLabsRepository {
  isAudioData(data: unknown): data is AudioData {
    return (
      typeof data === "object" &&
      data !== null &&
      "audio" in data &&
      "isFinal" in data &&
      "normalizedAlignment" in data &&
      "alignment" in data
    );
  }

  textToSpeech(
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
          websocket.send(
            JSON.stringify({ text, try_trigger_generation: true }),
          );
        }

        websocket.send(JSON.stringify({ text: "" }));
      };

      void streamText();
    });

    websocket.on("message", (data) => {
      if (this.isAudioData(data)) {
        audioData && audioData(data);
      }
    });
  }
}
