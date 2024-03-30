import WebSocket from "ws";

import { env } from "@seegull/env";
import { wsUrl } from "@seegull/services/elevenlabs";

import type { AudioData } from "../types/user/elevenlabs.types";
import { server } from "../server";
import { AudioDataSchema } from "../types/user/elevenlabs.types";

export class ElevenLabsRepository {
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
          server.log.info(`Sending text to ElevenLabs: ${text}`);
          websocket.send(
            JSON.stringify({ text, try_trigger_generation: true }),
          );
        }

        websocket.send(JSON.stringify({ text: "" }));
      };

      void streamText();
    });

    websocket.on("message", (data) => {
      console.log(
        "Received data from ElevenLabs: ",
        JSON.parse(data.toString()),
      );

      const parsedData = AudioDataSchema.parse(
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        JSON.parse(data.toString()),
      );

      audioData && audioData(parsedData);
    });

    websocket.on("close", () => {
      websocket.terminate();
    });
  }
}
