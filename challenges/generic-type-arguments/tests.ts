import { Expect, Equal } from 'type-testing';

type test_CapreseSaladName = Expect<Equal<
  CapreseSalad['name'],
  'Caprese Salad'
>>;

type test_CapreseSaladPrice = Expect<Equal<
  CapreseSalad['price'],
  14.99
>>;

type test_CapreseSaladInStock = Expect<Equal<
  CapreseSalad['inStock'],
  true
>>;

type test_KrogerDetroit = Expect<Equal<
  GroceryStore<'Kroger', 'Detroit'>,
  { name: 'Kroger', city: 'Detroit' }
>>;

type test_StopNShopMassachusetts = Expect<Equal<
  GroceryStore<'Stop \'N Shop', 'Massachusetts'>,
  { name: 'Stop \'N Shop', city: 'Massachusetts' }
>>;
