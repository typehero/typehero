import { Expect, Equal } from 'type-testing';

type cases = [
  Expect<Equal<RemoveNaughtyChildren<'good' | 'good' | 'good', 'naughty'>, 'good'>>,
  Expect<Equal<RemoveNaughtyChildren<'good' | 'naughty' | 'naughty', 'naughty'>, 'good'>>,
  Expect<Equal<RemoveNaughtyChildren<string | number | (() => void), Function>, string | number>>,
];
