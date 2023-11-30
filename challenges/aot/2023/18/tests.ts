import { Expect, Equal } from 'type-testing';

type SantasHood1 = [
  '🎁','🎁','🧦','🎁','🎁','🎁','🧦',
  '🎁','🎁','🎁','🧦','🎁','🎁','🧦',
  '🧦','🎁','🎁','🎁','🧦','🎁','🎁',
  '🎁','🎁'
];

type test_0_actual = Count<SantasHood1, '🎁'>;
//   ^?
type test_0_expected = 17;
type test_0 = Expect<Equal<test_0_expected, test_0_actual>>;

type test_1_actual = Count<SantasHood1, '🧦'>;
//   ^?
type test_1_expected = 6;
type test_1 = Expect<Equal<test_1_expected, test_1_actual>>;

type test_2_actual = Count<SantasHood1, '🎄'>;
//   ^?
type test_2_expected = 0;
type test_2 = Expect<Equal<test_2_expected, test_2_actual>>;



type SantasHood2 = [
  '🎁','🎁','🎁','🧦','🧦','🧦','🎁',
  '🎁','🎁','🧦','🎁','🎁','🧦','🧦',
  '🧦','🎁','🎁','🧦','🎁','🎁','🎁','🎁'
];

type test_3_actual = Count<SantasHood2, '🎁'>;
//   ^?
type test_3_expected = 14;
type test_3 = Expect<Equal<test_3_expected, test_3_actual>>;

type test_4_actual = Count<SantasHood2, '🧦'>;
//   ^?
type test_4_expected = 8;
type test_4 = Expect<Equal<test_4_expected, test_4_actual>>;


type SantasHood3 = [
  '🎁','🎁','🧦','🧦','🧦','🎁','🎁',
  '🎁','🧦','🎁','🎁','🧦','🧦','🧦',
  '🎁','🎁','🧦','🧦','🎁','🎁','🎁','🎁'
];

type test_5_actual = Count<SantasHood3, '🎁'>;
//   ^?
type test_5_expected = 13;
type test_5 = Expect<Equal<test_5_expected, test_5_actual>>;

type test_6_actual = Count<SantasHood3, '🧦'>;
//   ^?
type test_6_expected = 9;
type test_6 = Expect<Equal<test_6_expected, test_6_actual>>;