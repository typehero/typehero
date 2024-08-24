import { execSync } from 'node:child_process';

/**
 * 1. Accept code passed to it, with some identifiers
 * 2. Verify code contains only types
 * 3. Write code to disk, generate benchmark
 * 4. Run benchmark
 */
export const handler = async (event, context) => {
  console.info('EVENT', event);
  const b = execSync('pnpm tsx src/main.ts').toString();
  console.info('B', b);
  return {};
};
