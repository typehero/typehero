import { Expect, Equal } from "type-testing";

type test_0_actual = BoxArray<"nutcracker", 3 | 4>;
//   ^?
type test_0_expected =
  | ["nutcracker", "nutcracker", "nutcracker"]
  | ["nutcracker", "nutcracker", "nutcracker", "nutcracker"];
type test_0 = Expect<Equal<test_0_expected, test_0_actual>>;

type test_1_actual = BoxArray<"doll", 1>;
//   ^?
type test_1_expected = ["doll"];
type test_1 = Expect<Equal<test_1_expected, test_1_actual>>;