import { Expect, Equal } from 'type-testing';

type cases = [
  Expect<
    Equal<
      BoxToysByQuantity<'nutcracker', 3 | 4>,
      | ['nutcracker', 'nutcracker', 'nutcracker']
      | ['nutcracker', 'nutcracker', 'nutcracker', 'nutcracker']
    >
  >,
  Expect<Equal<BoxToysByQuantity<'doll', 1>, ['doll']>>,
];
