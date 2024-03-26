import { z } from "zod";

const AlignmentSchema = z.object({
  char_start_times_ms: z.array(z.number()).optional(),
  chars_durations_ms: z.array(z.number()).optional(),
  chars: z.array(z.string()).optional(),
});

const AudioDataSchema = z.object({
  audio: z.string().optional().nullable(),
  isFinal: z.boolean().optional().nullable(),
  normalizedAlignment: AlignmentSchema.optional().nullable(),
  alignment: AlignmentSchema.optional().nullable(),
});

type Alignment = z.infer<typeof AlignmentSchema>;
type AudioData = z.infer<typeof AudioDataSchema>;

export { AudioDataSchema, AlignmentSchema };
export type { Alignment, AudioData };
