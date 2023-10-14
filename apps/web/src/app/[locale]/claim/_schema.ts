import { z } from 'zod';

export const claimFormSchema = z.object({
  code: z.string().min(10).max(10),
});
