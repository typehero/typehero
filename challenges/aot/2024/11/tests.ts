import { Expect, Equal } from 'type-testing';

type test_0_actual = SantaListProtector<{
  //   ^?
  hacksore: () => 'naughty';
  trash: string;
  elliot: {
    penny: boolean;
    candace: {
      address: {
        street: {
          name: 'candy cane way';
          num: number;
        };
        k: 'hello';
      };
      children: [
        'harry',
        {
          saying: ['hey'];
        },
      ];
    };
  };
}>;
type test_0_expected = {
  readonly hacksore: () => 'naughty';
  readonly trash: string;
  readonly elliot: {
    readonly penny: boolean;
    readonly candace: {
      readonly address: {
        readonly street: {
          readonly name: 'candy cane way';
          readonly num: number;
        };
        readonly k: 'hello';
      };
      readonly children: readonly [
        'harry',
        {
          readonly saying: readonly ['hey'];
        },
      ];
    };
  };
};
type test_0 = Expect<Equal<test_0_expected, test_0_actual>>;

type test_1_actual = SantaListProtector<{
  //   ^?
  theo: () => 'naughty';
  prime: string;
  netflix: {
    isChill: boolean;
  };
}>;
type test_1_expected = {
  readonly theo: () => 'naughty';
  readonly prime: string;
  readonly netflix: {
    readonly isChill: boolean;
  };
};
type test_1 = Expect<Equal<test_1_expected, test_1_actual>>;
