import { ZodString, z } from 'zod';
import { containsProfanity } from '../../web/src/utils/profanity';

type Primitives = string | number | boolean | null;
type JsonValue = Primitives | JsonValue[] | { [key: string]: JsonValue };

const jsonStr = z.string().transform((str, ctx) => {
  try {
    return JSON.parse(str) as JsonValue;
  } catch (error) {
    ctx.addIssue({ code: 'custom', message: 'Needs to be JSON' });
  }
});

export function zodParams<TType>(schema: z.ZodType<TType>) {
  const querySchema = z.object({
    input: jsonStr.pipe(schema),
  });
  return {
    decodeRequest: (req: Request) => {
      const url = new URL(req.url);
      const obj = Object.fromEntries(url.searchParams.entries());

      return querySchema.safeParse(obj);
    },
    toSearchString: (obj: (typeof schema)['_input']) => {
      schema.parse(obj);
      return `input=${encodeURIComponent(JSON.stringify(obj))}`;
    },
  };
}

function truncateWordsFn(str: string, maxCharacters: number) {
  if (str.length <= maxCharacters) {
    return str;
  }
  // break at closest word
  const truncated = str.slice(0, maxCharacters);
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.slice(0, lastSpace) + '…';
}


// throws if string contains profanity, uses custom validate function
export function createNoProfanitySchemaWithValidate(validate: (zodString: ZodString) => ZodString) {
  return validate(z.string()).refine((str: any) => !containsProfanity(str), "Don't use profanity.");
}

// throws if string contains profanity, no other checks
export function createNoProfanitySchema() {
  return z.string().refine((str: any) => !containsProfanity(str), "Don't use profanity.");
}

// truncates to maxCharacters, throws if string contains profanity
export function truncateSchema(opts: { maxCharacters: number }) {
  return createNoProfanitySchema().transform((str) => truncateWordsFn(str, opts.maxCharacters));
}

export const fontParams = zodParams(
  z.object({
    family: z.string(),
    weight: z.number().default(400),
    text: z.string().optional(),
  }),
);

export const challengeParam = zodParams(
  z.object({
    title: truncateSchema({ maxCharacters: 70 }),
    description: truncateSchema({ maxCharacters: 145 }),
    username: truncateSchema({ maxCharacters: 70 }),
  }),
);

export const userParam = zodParams(
  z.object({
    username: truncateSchema({ maxCharacters: 70 }),
  }),
);

