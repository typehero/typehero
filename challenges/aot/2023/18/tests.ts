import { Expect, Equal } from 'type-testing';


type ToySack = [
	'🎸', '🎧', '👟', '👟', '💻', '🪀', '🧩', '🎮',
	'🎨', '🕹️', '📱', '🧩', '🧸', '🎧', '👟', '🚲',
	'📚', '⌚', '🎨', '👟', '🎸', '🧸', '👟', '🎸',
	'📱', '🎧', '🎮', '🎒', '📱', '🧩', '🧩', '🚲',
	'🕹️', '🧵', '📱', '🕹️', '🕰️', '🧢', '🕹️', '👟',
	'🧸', '📚', '🧁', '🧩', '🎸', '🎮', '🧁', '📚',
	'💻', '⌚', '🛹', '🧁', '🧣', '🪁', '🎸', '🧸',
	'🧸', '🧸', '🧩', '🪁', '🏎️', '🏎️', '🧁', '📚',
	'🧸', '🕶️', '💻', '⌚', '⌚', '🕶️', '🎧', '🎧',
	'🎧', '💻', '👟', '🎸', '💻', '🪐', '📚', '🎨',
	'📱', '🎧', '📱', '🎸', '🏎️', '👟', '🚲', '📱',
	'🚲', '🎸'
];

type test_0_actual = Count<ToySack, '👟'>;
//   ^?
type test_0_expected = 8;
type test_0 = Expect<Equal<test_0_expected, test_0_actual>>;

type test_1_actual = Count<ToySack, '🧦'>;
//   ^?
type test_1_expected = 0;
type test_1 = Expect<Equal<test_1_expected, test_1_actual>>;

type test_2_actual = Count<ToySack, '🧩'>;
//   ^?
type test_2_expected = 6;
type test_2 = Expect<Equal<test_2_expected, test_2_actual>>;

type test_3_actual = Count<ToySack, '🛹'>;
//   ^?
type test_3_expected = 1;
type test_3 = Expect<Equal<test_3_expected, test_3_actual>>;

type test_4_actual = Count<ToySack, '🏎️'>;
//   ^?
type test_4_expected = 3;
type test_4 = Expect<Equal<test_4_expected, test_4_actual>>;

type test_5_actual = Count<ToySack, '📚'>;
//   ^?
type test_5_expected = 5;
type test_5 = Expect<Equal<test_5_expected, test_5_actual>>;