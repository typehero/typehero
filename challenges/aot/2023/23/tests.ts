import { Expect, Equal } from 'type-testing';

type SudokuItems = '🎄' | '🎅' | '🦌' | '🎁' | '⛄' | '🕯️' | '🌟' | '🧦' | '🔔';

type cases = [
  Expect<Equal<Validate<SudoKu1>, true>>,
  Expect<Equal<Validate<SudoKu2>, true>>,
  Expect<Equal<Validate<SudoKu3>, true>>,
  Expect<Equal<Validate<SudoKu4>, false>>,
  Expect<Equal<Validate<SudoKu5>, false>>,
  Expect<Equal<Validate<SudoKu6>, false>>,
];
