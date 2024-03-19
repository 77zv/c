import { z } from "zod";

const AlignmentSchema = z.object({
  char_start_times_ms: z.array(z.number()),
  chars_durations_ms: z.array(z.number()),
  chars: z.array(z.string()),
});

const AudioDataSchema = z.object({
  audio: z.string(),
  isFinal: z.boolean(),
  normalizedAlignment: AlignmentSchema,
  alignment: AlignmentSchema,
});

type Alignment = z.infer<typeof AlignmentSchema>;
type AudioData = z.infer<typeof AudioDataSchema>;

export { AudioDataSchema, AlignmentSchema };
export type { Alignment, AudioData };
