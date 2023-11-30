import { Expect, Equal } from 'type-testing';

type cases = [
  Expect<Equal<Reverse<'rehsaD'>, 'Dasher'>>,
  Expect<Equal<Reverse<'recnaD'>, 'Dancer'>>,
  Expect<Equal<Reverse<'recnarP'>, 'Prancer'>>,
  Expect<Equal<Reverse<'nexiV'>, 'Vixen'>>,
  Expect<Equal<Reverse<'temoC'>, 'Comet'>>,
  Expect<Equal<Reverse<'dipuC'>, 'Cupid'>>,
  Expect<Equal<Reverse<'rennoD'>, 'Donner'>>,
  Expect<Equal<Reverse<'neztilB'>, 'Blitzen'>>,
  Expect<Equal<Reverse<'hploduR'>, 'Rudolph'>>,
];
