import { env } from "@seegull/env";

type Alignment = {
  char_start_times_ms: number[];
  chars_durations_ms: number[];
  chars: string[];
};

export interface AudioData {
  audio: string; // Base64 encoded string
  isFinal: boolean;
  normalizedAlignment: Alignment;
  alignment: Alignment;
}

export const wsUrl = [
  "wss://api.elevenlabs.io/v1/text-to-speech/",
  env.ELEVEN_LABS_VOICE_ID,
  "/stream-input?model_id=",
  env.ELEVEN_LABS_MODEL,
  "&optimize_streaming_latency=0",
].join("");

export const isAudioData = (data: unknown): data is AudioData => {
  return (
    typeof data === "object" &&
    data !== null &&
    "audio" in data &&
    "isFinal" in data &&
    "normalizedAlignment" in data &&
    "alignment" in data
  );
};
