import { Expect, Equal } from 'type-testing';

type RockPaperScissors = '👊🏾' | '🖐🏾' | '✌🏽';

type cases = [
  Expect<Equal<WhoWins<'👊🏾', '🖐🏾'>, 'win'>>,
  Expect<Equal<WhoWins<'👊🏾', '✌🏽'>, 'lose'>>,
  Expect<Equal<WhoWins<'👊🏾', '👊🏾'>, 'draw'>>,
  Expect<Equal<WhoWins<'🖐🏾', '👊🏾'>, 'lose'>>,
  Expect<Equal<WhoWins<'🖐🏾', '✌🏽'>, 'win'>>,
  Expect<Equal<WhoWins<'🖐🏾', '🖐🏾'>, 'draw'>>,
  Expect<Equal<WhoWins<'✌🏽', '👊🏾'>, 'win'>>,
  Expect<Equal<WhoWins<'✌🏽', '✌🏽'>, 'draw'>>,
  Expect<Equal<WhoWins<'✌🏽', '🖐🏾'>, 'lose'>>,
];
