import { env } from "@seegull/env";


export const wsUrl = [
  "wss://api.elevenlabs.io/v1/text-to-speech/",
  env.ELEVEN_LABS_VOICE_ID,
  "/stream-input?model_id=",
  env.ELEVEN_LABS_MODEL,
  "&optimize_streaming_latency=0",
].join("");
