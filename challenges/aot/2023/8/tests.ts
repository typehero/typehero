import { Expect, Equal } from 'type-testing';

type SantasList = {
  naughty_tom: { address: '1 candy cane lane' };
  good_timmy: { address: '43 chocolate dr' };
  naughty_trash: { address: '637 starlight way' };
  naughty_candace: { address: '12 aurora' };
};

type test_wellBehaved = Expect<
  Equal<
    RemoveMisbehavingPeople<SantasList>,
    {
      good_timmy: { address: '43 chocolate dr' };
    }
  >
>;

type Unrelated = {
  dont: 'cheat';
  naughty_play: 'fair';
};

type test_Unrelated = Expect<
  Equal<
    RemoveMisbehavingPeople<Unrelated>,
    {
      dont: 'cheat';
    }
  >
>;
