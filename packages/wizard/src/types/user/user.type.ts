import { z } from "zod";

export interface User {
  id: string;
  name: string;
}

export const User = z.object({
  id: z.string(),
  name: z.string(),
});
