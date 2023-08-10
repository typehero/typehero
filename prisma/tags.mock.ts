
import type { Prisma, PrismaClient } from '@prisma/client';
import resolveConfig from 'tailwindcss/resolveConfig';
import { faker } from '@faker-js/faker'
import type { Config } from 'tailwindcss';
import tailwindConfig from '../tailwind.config';
import type { RecursiveKeyValuePair } from 'tailwindcss/types/config';

export function makeTag(): Prisma.TagCreateInput {
  return {
    name: faker.word.adverb(),
    color: faker.color.rgb(),
  };
}

const config = resolveConfig(tailwindConfig as unknown as Config);
console.info(config.theme?.colors);

let allColors: string[] = [];

function flattenTwindColors(value: RecursiveKeyValuePair<string, string>): string[] {
  return Object.values(value)
    .flatMap(v => {
      if(typeof v === 'object') return flattenTwindColors(v);
      return v
    })
    .filter(v => typeof v === 'string' && v.startsWith('#'))
    .sort((a, b) => a < b ? -1 : a===b  ? 0 : 1);
}

if(config.theme?.colors) {
  allColors = flattenTwindColors(config.theme.colors);
}

console.info('allColors!', allColors);



/**
 * 
 * @param name the value we are turning into a deterministic hex code
 * @returns 
 */
function getColor(name: string): string {
  // Cleans non alpha numeric values from it.
  const cleaned = name.replace(/[^a-z0-9]/g, '');
  const fullNum = parseInt(cleaned, 36);

  const hexNum = fullNum.toString(16);
  return `#${hexNum.replace(/(.{1,2})/g, whole => `0${whole}`.slice(-2)).repeat(2).slice(0, 6)}`;
}

const all = [
  'infer',
  'built-in',
  'union',
  'utils',
  'object-keys',
  'this',
  'vue',
  'readonly',
  'deep',
  'tuple',
  'array',
  'promise',
  'arguments',
  'string',
  'object',
  'recursion',
  'split',
  'json',
] as const;

const baseTags: Prisma.TagCreateInput[] = all.map(i => ({
  name: i,
  color: getColor(i),
}));

/**
 * @description Builds the base tags for us to have in the system.
 */
export async function seedBaseTags(client: PrismaClient) {
  return client.tag.createMany({
    data: baseTags,
  });
}