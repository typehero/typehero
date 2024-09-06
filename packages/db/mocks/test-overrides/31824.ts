import type { Equal, Expect } from '@type-challenges/utils';

type Pred = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

type Dig = Pred[number];

type Reped<T extends string, N extends Dig, Acc extends string = ''> = N extends 0
  ? Acc
  : Reped<T, Pred[N], `${Acc}${T}`>;

type T1 = 'k';
type T10 = `${T1}${T1}${T1}${T1}${T1}${T1}${T1}${T1}${T1}${T1}`;
type T100 = `${T10}${T10}${T10}${T10}${T10}${T10}${T10}${T10}${T10}${T10}`;
type T1K = `${T100}${T100}${T100}${T100}${T100}${T100}${T100}${T100}${T100}${T100}`;
type T10K = `${T1K}${T1K}${T1K}${T1K}${T1K}${T1K}${T1K}${T1K}${T1K}${T1K}`;
type T100K = `${T10K}${T10K}${T10K}${T10K}${T10K}${T10K}${T10K}${T10K}${T10K}${T10K}`;
type T1M = `${T100K}${T100K}${T100K}${T100K}${T100K}${T100K}${T100K}${T100K}${T100K}${T100K}`;

type Digs<T extends string, Acc extends readonly Dig[] = []> = T extends `${infer Head extends
  Dig}${infer Rest}`
  ? Digs<Rest, [...Acc, Head]>
  : Acc;

type Gened<T extends string> = Digs<T> extends [
  infer C1M extends Dig,
  infer C100K extends Dig,
  infer C10K extends Dig,
  infer C1K extends Dig,
  infer C100 extends Dig,
  infer C10 extends Dig,
  infer C1 extends Dig,
]
  ? Reped<T1M, C1M> extends infer R1M extends string
    ? Reped<T100K, C100K> extends infer R100K extends string
      ? Reped<T10K, C10K> extends infer R10K extends string
        ? Reped<T1K, C1K> extends infer R1K extends string
          ? Reped<T100, C100> extends infer R100 extends string
            ? Reped<T10, C10> extends infer R10 extends string
              ? Reped<T1, C1> extends infer R1 extends string
                ? `${R1M}${R100K}${R10K}${R1K}${R100}${R10}${R1}`
                : never
              : never
            : never
          : never
        : never
      : never
    : never
  : never;

type cases = [
  Expect<Equal<LengthOfString<Gened<'0000000'>>, 0>>,
  Expect<Equal<LengthOfString<Gened<'0000001'>>, 1>>,
  Expect<Equal<LengthOfString<Gened<'0000002'>>, 2>>,
  Expect<Equal<LengthOfString<Gened<'0000003'>>, 3>>,
  Expect<Equal<LengthOfString<Gened<'0000004'>>, 4>>,
  Expect<Equal<LengthOfString<Gened<'0000005'>>, 5>>,
  Expect<Equal<LengthOfString<Gened<'0000055'>>, 55>>,
  Expect<Equal<LengthOfString<Gened<'0000555'>>, 555>>,
  Expect<Equal<LengthOfString<Gened<'0005555'>>, 5555>>,
  Expect<Equal<LengthOfString<Gened<'0055555'>>, 55555>>,
  Expect<Equal<LengthOfString<Gened<'8464592'>>, 8464592>>,
  Expect<Equal<LengthOfString<Gened<'1373690'>>, 1373690>>,
  Expect<Equal<LengthOfString<Gened<'1707793'>>, 1707793>>,
  Expect<Equal<LengthOfString<Gened<'0196268'>>, 196268>>,
  Expect<Equal<LengthOfString<Gened<'6646734'>>, 6646734>>,
  Expect<Equal<LengthOfString<Gened<'0538159'>>, 538159>>,
  Expect<Equal<LengthOfString<Gened<'0058901'>>, 58901>>,
  Expect<Equal<LengthOfString<Gened<'8414001'>>, 8414001>>,
  Expect<Equal<LengthOfString<Gened<'1740697'>>, 1740697>>,
  Expect<Equal<LengthOfString<Gened<'2281441'>>, 2281441>>,
];
