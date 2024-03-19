import { z } from "zod";

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
});

type User = z.infer<typeof UserSchema>;

export { UserSchema };
export type { User };
