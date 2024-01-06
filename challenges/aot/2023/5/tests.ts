import { Expect, Equal } from 'type-testing';

const bads = ['tommy', 'trash'] as const;
const goods = ['bash', 'tru'] as const;

type test_0_actual = SantasList<typeof bads, typeof goods>;
//   ^?
type test_0_expected = ['tommy', 'trash', 'bash', 'tru'];
type test_0 = Expect<Equal<test_0_actual, test_0_expected>>;

type test_1_actual = SantasList<[], []>;
//   ^?
type test_1_expected = [];
type test_1 = Expect<Equal<test_1_actual, test_1_expected>>;

type test_2_actual = SantasList<[], ['trash']>;
//   ^?
type test_2_expected = ['trash'];
type test_2 = Expect<Equal<test_2_actual, test_2_expected>>;

type test_3_actual = SantasList<['john'], ['ashley', 'elliot', 'ziltoid']>;
//   ^?
type test_3_expected = ['john', 'ashley', 'elliot', 'ziltoid'];
type test_3 = Expect<Equal<test_3_actual, test_3_expected>>;

type test_4_actual = SantasList<['1', 2, '3'], [false, boolean, '4', ['nested']]>;
//   ^?
type test_4_expected = ['1', 2, '3', false, boolean, '4', ['nested']];
type test_4 = Expect<Equal<test_4_actual, test_4_expected>>;

// @ts-expect-error
type error_0 = SantasList<null, undefined>;
