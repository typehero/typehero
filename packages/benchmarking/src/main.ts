import { bench } from '@ark/attest';

type MyAwaited<T extends PromiseLike<any>> = T extends PromiseLike<infer R>
  ? R extends PromiseLike<any>
    ? MyAwaited<R>
    : R
  : T;

bench('Testing', () => {
  return 'bob' as any as MyAwaited<Promise<string>>;
})
  .mean([0.22, 'ns'])
  .types([403, 'instantiations']);
