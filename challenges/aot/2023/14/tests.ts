import { Expect, Equal } from 'type-testing';

type cases = [
  Expect<Equal<DecipherNaughtyList<'timmy/jimmy'>, 'jimmy' | 'timmy'>>,
  Expect<Equal<DecipherNaughtyList<'elliot'>, 'elliot'>>,
  Expect<
    Equal<DecipherNaughtyList<'melkey/prime/theo/trash'>, 'melkey' | 'prime' | 'theo' | 'trash'>
  >,
];
