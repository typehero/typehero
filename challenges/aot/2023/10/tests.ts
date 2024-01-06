import { Expect, Equal } from 'type-testing';

type test_0_actual = StreetSuffixTester<'Candy Cane Way', 'Way'>;
//   ^?
type test_0_expected = true;
type test_0 = Expect<Equal<test_0_expected, test_0_actual>>;

type test_1_actual = StreetSuffixTester<'Chocalate Drive', 'Drive'>;
//   ^?
type test_1_expected = true;
type test_1 = Expect<Equal<test_1_expected, test_1_actual>>;

type test_2_actual = StreetSuffixTester<'Sugar Lane', 'Drive'>;
//   ^?
type test_2_expected = false;
type test_2 = Expect<Equal<test_2_expected, test_2_actual>>;

type test_3_actual = StreetSuffixTester<'Fifth Dimensional Nebulo 9', 'invalid'>;
//   ^?
type test_3_expected = false;
type test_3 = Expect<Equal<test_3_expected, test_3_actual>>;