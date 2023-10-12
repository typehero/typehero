import { Expect, Equal } from 'type-testing';

type test_LiteralString = Expect<Equal<
  LiteralString,
  'chocolate chips'
>>;

type test_LiteralTrue = Expect<Equal<
  LiteralTrue,
  true
>>;

type test_LiteralNumber = Expect<Equal<
  LiteralNumber,
  5
>>;

type test_LiteralObject = Expect<Equal<
  LiteralObject,
  {
    name: 'chocolate chips',
    inStock: true,
    kilograms: 5,
  }
>>;