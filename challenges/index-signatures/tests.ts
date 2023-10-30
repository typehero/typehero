const groceryList: GroceryList = {
  carrots: 5,
  potatoes: 12,
  sweetPotatoes: 2,
  turnips: 1,
  parsnips: 1,
  beets: 10,
  radishes: 2,
  rutabagas: 1,
  onions: 3,
  garlic: 2,

  // @ts-expect-error intentionally invalid
  shouldError: "because it's a string",

  // @ts-expect-error intentionally invalid
  shouldAlsoError: true,
};

const inappropriateActionBySituation: InappropriateActionBySituation = {
  funeral: ['excessive laughter', 'bringing up personal achievements'],
  medicalDiagnosis: [
    'jokes about American healthcare',
    'WebMD',
    'doomscrolling twitter instead of listening',
  ],
  leetcodeInterview: [
    'praise of CSS',
    'citing XKCD comics by number from memory',
    'use of emojis in whiteboard exercises followed by pontificating about your deep knowledge of UTF-16',
  ],
  friendExperiencingHeartbreak: [
    'victory dance because you hated their S.O.',
    'offers to turn on the 1999 cinematic masterpiece, The Mummy, with Brendan Fraser and Rachel Weisz',
  ],
};

const charactersById: CharactersById = {
  1: {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
  },
  2: {
    id: 2,
    name: 'Morty Smith',
    status: 'Alive',
    species: 'Human',
  },
  3: {
    id: 3,
    name: 'Summer Smith',
    status: 'Alive',
    species: 'Human',
  },
  4: {
    id: 4,
    name: 'Beth Smith',
    status: 'Alive',
    species: 'Human',
  },
  5: {
    id: 5,
    name: 'Jerry Smith',
    status: 'Alive',
    species: 'Human',
  },
};

// You shouldn't worry much about these tests below. Just make sure you avoid using 'any' and/or 'unknown'!
import { Equal, Extends, Expect } from 'type-testing';

type testCaseGroceryListCheck = Expect<Extends<string, keyof GroceryList>>;
type GroceryListValues = GroceryList[keyof GroceryList];
type testCaseGroceryListCheck2 = Expect<Equal<GroceryListValues, number>>;

type testCaseInappropriateActionBySituation = Expect<
  Extends<string, keyof InappropriateActionBySituation>
>;
type InappropriateActionBySituationValues =
  InappropriateActionBySituation[keyof InappropriateActionBySituation];
type testCaseInappropriateActionBySituation2 = Expect<
  NotEqual<InappropriateActionBySituationValues, any>
>;
type testCaseInappropriateActionBySituation3 = Expect<
  NotEqual<InappropriateActionBySituationValues, Array<any>>
>;
type testCaseInappropriateActionBySituation4 = Expect<
  NotEqual<InappropriateActionBySituationValues, unknown>
>;
type testCaseInappropriateActionBySituation5 = Expect<
  NotEqual<InappropriateActionBySituationValues, Array<unknown>>
>;

type testCaseCharactersById = Expect<Extends<number, keyof CharactersById>>;
type CharactersByIdValues = CharactersById[keyof CharactersById];
type testCaseCharactersById2 = Expect<NotEqual<CharactersByIdValues, any>>;
type testCaseCharactersById3 = Expect<NotEqual<CharactersByIdValues, unknown>>;
type CharactersByIdValuesOfValues = CharactersByIdValues[keyof CharactersByIdValues];
type testCaseCharactersById4 = Expect<NotEqual<CharactersByIdValuesOfValues, any>>;
type testCaseCharactersById5 = Expect<NotEqual<CharactersByIdValuesOfValues, unknown>>;
