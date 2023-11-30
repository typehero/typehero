import { Expect, Equal } from 'type-testing';

type EmptyBoard = [['  ', '  ', '  '], ['  ', '  ', '  '], ['  ', '  ', '  ']];

type NewGame = {
  board: EmptyBoard;
  state: '❌';
};

type cases = [
  Expect<
    Equal<
      TicTacToe<NewGame, 'top-center'>,
      {
        // prettier-ignore
        board: [
          [ '  ', '❌', '  ' ],
          [ '  ', '  ', '  ' ],
          [ '  ', '  ', '  ' ]
        ];
        state: '⭕';
      }
    >
  >,
  Expect<
    Equal<
      // invalid move don't change the board and state
      TicTacToe<TicTacToe<NewGame, 'top-center'>, 'top-center'>,
      {
        // prettier-ignore
        board: [
          [ '  ', '❌', '  ' ],
          [ '  ', '  ', '  ' ],
          [ '  ', '  ', '  ' ]
        ];
        state: '⭕';
      }
    >
  >,
  Expect<
    Equal<
      TicTacToe<TicTacToe<NewGame, 'top-center'>, 'top-left'>,
      {
        // prettier-ignore
        board: [
          ['⭕', '❌', '  '],
          ['  ', '  ', '  '],
          ['  ', '  ', '  ']];
        state: '❌';
      }
    >
  >,
  Expect<
    Equal<
      TicTacToe<TicTacToe<TicTacToe<NewGame, 'top-center'>, 'top-left'>, 'middle-center'>,
      {
        // prettier-ignore
        board: [
          [ '⭕', '❌', '  ' ],
          [ '  ', '❌', '  ' ],
          [ '  ', '  ', '  ' ]
        ];
        state: '⭕';
      }
    >
  >,
  Expect<
    Equal<
      TicTacToe<
        TicTacToe<TicTacToe<TicTacToe<NewGame, 'top-center'>, 'top-left'>, 'middle-center'>,
        'bottom-left'
      >,
      {
        // prettier-ignore
        board: [
          [ '⭕', '❌', '  ' ],
          [ '  ', '❌', '  ' ],
          [ '⭕', '  ', '  ' ]
        ];
        state: '❌';
      }
    >
  >,
  Expect<
    Equal<
      TicTacToe<
        TicTacToe<
          TicTacToe<TicTacToe<TicTacToe<NewGame, 'top-center'>, 'top-left'>, 'middle-center'>,
          'bottom-left'
        >,
        'bottom-center'
      >,
      {
        // prettier-ignore
        board: [
          [ '⭕', '❌', '  ' ],
          [ '  ', '❌', '  ' ],
          [ '⭕', '❌', '  ' ]
        ];
        state: '❌ Won';
      }
    >
  >,
];
