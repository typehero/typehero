import { z } from 'zod';
import { createNoProfanitySchemaWithValidate } from '~/utils/antiProfanityZod';

const validUrlWithHttpOrHttps = z.string().refine(
  (url) => {
    try {
      const parsedUrl = new URL(url);
      return ['https:', 'http:'].includes(parsedUrl.protocol);
    } catch {
      return false;
    }
  },
  {
    message: "URL must have the 'http(s)' protocol",
  },
);

export const EditFormSchema = z.object({
  bio: createNoProfanitySchemaWithValidate((str) => str.max(256)),
  userLinks: z.array(
    z.object({
      url: createNoProfanitySchemaWithValidate((str) => str.url().max(256))
        .and(validUrlWithHttpOrHttps)
        .or(z.literal('')),
    }),
  ),
});
export type EditFormSchema = z.infer<typeof EditFormSchema>;
