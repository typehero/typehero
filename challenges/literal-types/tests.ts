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
  LiteralNumbers,
  1 | 2 | 3 | 4 | 5 | 6
>>;

type test_LiteralObject = Expect<Equal<
  LiteralObject,
  {
    name: 'chocolate chips',
    inStock: true,
    kilograms: 5,
  }
>>;

type test_LiteralFunction = Expect<Equal<
  LiteralFunction,
  (a: number, b: number) => number
>>;

type test_literalString = Expect<Equal<
  typeof literalString,
  'Ziltoid the Omniscient'
>>;

type test_literalTrue = Expect<Equal<
  typeof literalTrue,
  true
>>;

type test_literalNumber = Expect<Equal<
  typeof literalNumber,
  1 | 2
>>;

type test_literalObject = Expect<Equal<
  typeof literalObject,
  {
    origin: "far across the omniverse",
    command: "fetch",
    item: "the universe's ultimate cup of coffee (black)",
    time: "five Earth minutes"
  }
>>;

type test_literalFunction = Expect<Equal<
  typeof literalFunction,
  (a: number, b: string) => string | number
>>;
