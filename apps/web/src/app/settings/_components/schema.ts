import { z } from 'zod';
import { createNoProfanitySchemaWithValidate } from '~/utils/antiProfanityZod';

export const appearanceFormSchema = z.object({
  theme: z.enum(['light', 'dark'], {
    required_error: 'Please select a theme.',
  }),
  font: z.enum(['inter', 'manrope', 'system'], {
    invalid_type_error: 'Select a font',
    required_error: 'Please select a font.',
  }),
});

export type ApperenceFormSchema = z.infer<typeof appearanceFormSchema>;

// returns true/false if the url contains a https/http proto
const validUrlWithHttpOrHttps = z.string().refine(
  (url) => {
    try {
      const parsedUrl = new URL(url);
      return ['https:', 'http:'].includes(parsedUrl.protocol);
    } catch (error) {
      return false;
    }
  },
  {
    message: "URL must have the 'http(s)' protocol",
  },
);

export const profileSchema = z.object({
  bio: createNoProfanitySchemaWithValidate((str) => str.max(256)),
  userLinks: z.array(
    z.object({
      id: z.union([z.string(), z.null()]),
      url: z.union([
        createNoProfanitySchemaWithValidate((str) => str.url().max(256)).and(
          validUrlWithHttpOrHttps,
        ),
        z.literal(''),
      ]),
    }),
  ),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
