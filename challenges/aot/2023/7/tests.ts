import { Expect, Equal } from 'type-testing';

type WellBehavedList = {
  tom: { address: '1 candy cane lane' };
  timmy: { address: '43 chocolate dr' };
  trash: { address: '637 starlight way' };
  candace: { address: '12 aurora' };
};

type test_wellBehaved = Expect<
  Equal<
    AppendGood<WellBehavedList>,
    {
      good_tom: { address: '1 candy cane lane' };
      good_timmy: { address: '43 chocolate dr' };
      good_trash: { address: '637 starlight way' };
      good_candace: { address: '12 aurora' };
    }
  >
>;

type Unrelated = {
  dont: 'cheat';
  play: 'fair';
};

type test_Unrelated = Expect<
  Equal<
    AppendGood<Unrelated>,
    {
      good_dont: 'cheat';
      good_play: 'fair';
    }
  >
>;
