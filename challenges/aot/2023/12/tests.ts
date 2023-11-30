import { Expect, Equal } from 'type-testing';

type Forest1 = ['🎅🏼', '🎄', '🎄', '🎄'];

type Forest2 = ['🎄', '🎅🏼', '🎄', '🎄', '🎄', '🎄'];

type Forest3 = ['🎄', '🎄', '🎅🏼', '🎄'];

type Forest4 = ['🎄', '🎄', '🎄', '🎅🏼', '🎄'];

type Forest5 = ['🎄', '🎄', '🎄', '🎄'];

type cases = [
  Expect<Equal<FindSanta<Forest1>, 0>>,
  Expect<Equal<FindSanta<Forest2>, 1>>,
  Expect<Equal<FindSanta<Forest3>, 2>>,
  Expect<Equal<FindSanta<Forest4>, 3>>,
  Expect<Equal<FindSanta<Forest5>, never>>,
];
