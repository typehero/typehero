/**
 * Type-only re-export so client code can reference AppRouter without
 * pulling the server router module graph (auth, prisma, etc.) into the
 * browser bundle. Use `import type` / `export type` only.
 */
export type { AppRouter } from '~/server/api/root';
