import { unstable_cache } from 'next/cache';

export async function withUnstableCache<T extends (...args: any[]) => Promise<any>>(opts: {
  fn: T;
  args: Parameters<T>;
  tags: string[];
}) {
  const cachedResult = await unstable_cache(
    async (...args) => {
      const result = await opts.fn(...args);
      return result;
    },
    undefined,
    { tags: opts.tags },
  )(...opts.args);

  return cachedResult as Awaited<ReturnType<T>>;
}
