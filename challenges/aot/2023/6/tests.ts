import { Expect, Equal } from 'type-testing';

type test_0_actual = RemoveNaughtyChildren<
  //   ^?
  'good' | 'good' | 'good',
  'naughty'
>;
type test_0_expected = 'good';
type test_0 = Expect<Equal<test_0_expected, test_0_actual>>;

type test_1_actual = RemoveNaughtyChildren<
  //   ^?
  'good' | 'naughty' | 'naughty',
  'naughty'
>;
type test_1_expected = 'good';
type test_1 = Expect<Equal<test_1_expected, test_1_actual>>;

type test_2_actual = RemoveNaughtyChildren<
  //   ^?
  string | number | (() => void),
  Function
>;
type test_2_expected = string | number;
type test_2 = Expect<Equal<test_2_expected, test_2_actual>>;
