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
  shouldAlsoError: true
};

// note: these can change.  I'm tired, haha.  Maybe they're funny?  Tomorrow will tell.
const innapropriateActionBySituation: InnapropriateActionBySituation = {
  funeral: ['excessive laughter', 'bringing up personal achievements'],
  medicalDiagnosis: ['jokes about American healthcare', 'WebMD', 'doomscrolling twitter instead of listening'],
  leetcodeInterview: ['praise of CSS', 'citing XKCD comics by number from memory', 'use of emojis in whiteboard exercises followed by pontificating about your deep knowledge of UTF-16'],
  friendExperiencingHeartbreak: ['victory dance because you hated their S.O.', 'offers to turn on the 1999 cinematic masterpiece, The Mummy, with Brendan Fraser and Rachel Weisz'],
};

const charactersById: CharactersById = {
  1: {
    id: 1,
    name: "Rick Sanchez",
    status: "Alive",
    species: "Human",
  },
  2: {
    id: 2,
    name: "Morty Smith",
    status: "Alive",
    species: "Human",
  },
  3: {
    id: 3,
    name: "Summer Smith",
    status: "Alive",
    species: "Human",
  },
  4: {
    id: 4,
    name: "Beth Smith",
    status: "Alive",
    species: "Human",
  },
  5: {
    id: 5,
    name: "Jerry Smith",
    status: "Alive",
    species: "Human",
  },
};
