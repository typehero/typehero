type Connect4Chips = '🔴' | '🟡';
type Connect4Cell = Connect4Chips | '  ';
type Connect4State = '🔴' | '🟡' | '🔴 Won' | '🟡 Won' | 'Draw';

type EmptyBoard = [
  ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
  ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
  ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
  ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
  ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
  ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
];

type NewGame = {
  board: EmptyBoard;
  state: '🟡';
};

type Connect4 = unknown;
