import { Expect, Equal } from 'type-testing';

type cases = [
  Expect<Equal<SantaListProtector<CaseOne>, ExpectedCaseOne>>,
  Expect<Equal<SantaListProtector<CaseTwo>, ExpectedCaseTwo>>,
];

type CaseOne = {
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
};

type ExpectedCaseOne = {
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

type CaseTwo = {
  theo: () => 'naughty';
  prime: string;
  netflix: {
    isChill: boolean;
  };
};

type ExpectedCaseTwo = {
  readonly theo: () => 'naughty';
  readonly prime: string;
  readonly netflix: {
    readonly isChill: boolean;
  };
};
