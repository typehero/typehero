import { Expect, Equal } from 'type-testing';

type SantasNotebook1 = [2, 1, 3, 3];
type SantasNotebook2 = [3, 3, 2, 1];
type SantasNotebook3 = [2, 3, 3, 1];

type SantasHood1 = ['🎁', '🎁', '🧦', '🎁', '🎁', '🎁', '🧦', '🧦', '🧦'];
type SantasHood2 = ['🎁', '🎁', '🎁', '🧦', '🧦', '🧦', '🎁', '🎁', '🧦'];
type SantasHood3 = ['🎁', '🎁', '🧦', '🧦', '🧦', '🎁', '🎁', '🎁', '🧦'];

type cases = [
  Expect<Equal<Rebuild<SantasNotebook1>, SantasHood1>>,
  Expect<Equal<Rebuild<SantasNotebook2>, SantasHood2>>,
  Expect<Equal<Rebuild<SantasNotebook3>, SantasHood3>>,
];
