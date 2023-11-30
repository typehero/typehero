import { Expect, Equal } from 'type-testing';

type cases = [
  Expect<Equal<StreetSuffixTester<'Candy Cane Way', 'Way'>, true>>,
  Expect<Equal<StreetSuffixTester<'Chocalate Drive', 'Drive'>, true>>,
  Expect<Equal<StreetSuffixTester<'Sugar Lane', 'Drive'>, false>>,
  Expect<Equal<StreetSuffixTester<'In The Abyss', 'invalid'>, false>>,
];
