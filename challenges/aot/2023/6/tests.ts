import { Expect, Equal } from 'type-testing';

type test_0_actual = FilterChildrenBy<
  //   ^?
  'nice' | 'nice' | 'nice',
  'naughty'
>;
type test_0_expected = 'nice';
type test_0 = Expect<Equal<test_0_expected, test_0_actual>>;

type test_1_actual = FilterChildrenBy<
  //   ^?
  'nice' | 'naughty' | 'naughty',
  'naughty'
>;
type test_1_expected = 'nice';
type test_1 = Expect<Equal<test_1_expected, test_1_actual>>;

type test_2_actual = FilterChildrenBy<
  //   ^?
  string | number | (() => void),
  Function
>;
type test_2_expected = string | number;
type test_2 = Expect<Equal<test_2_expected, test_2_actual>>;
