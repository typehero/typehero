import { Expect, Equal } from 'type-testing';

type HoodContent = '🎁' | '🧦' | '🎄';

// prettier-ignore
type SantasHood1 = [
  '🎁','🎁','🧦','🎁','🎁','🎁','🧦',
  '🎁','🎁','🎁','🧦','🎁','🎁','🧦',
  '🧦','🎁','🎁','🎁','🧦','🎁','🎁',
  '🎁','🎁'
];
// prettier-ignore
type SantasHood2 = [
  '🎁','🎁','🎁','🧦','🧦','🧦','🎁',
  '🎁','🎁','🧦','🎁','🎁','🧦','🧦',
  '🧦','🎁','🎁','🧦','🎁','🎁','🎁','🎁'
];

// prettier-ignore
type SantasHood3 = [
  '🎁','🎁','🧦','🧦','🧦','🎁','🎁',
  '🎁','🧦','🎁','🎁','🧦','🧦','🧦',
  '🎁','🎁','🧦','🧦','🎁','🎁','🎁','🎁'
];

type cases = [
  Expect<Equal<Count<SantasHood1, '🎁'>, 17>>,
  Expect<Equal<Count<SantasHood1, '🧦'>, 6>>,
  Expect<Equal<Count<SantasHood1, '🎄'>, 0>>,
  Expect<Equal<Count<SantasHood2, '🎁'>, 14>>,
  Expect<Equal<Count<SantasHood2, '🧦'>, 8>>,
  Expect<Equal<Count<SantasHood3, '🎁'>, 13>>,
  Expect<Equal<Count<SantasHood3, '🧦'>, 9>>,
];
