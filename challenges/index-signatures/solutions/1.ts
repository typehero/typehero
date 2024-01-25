type GroceryList = {
  [groceryItem: string]: number;
};

type InappropriateActionBySituation = {
  [situation: string]: string[];
};

type CharactersById = {
  [character: number]: {
    id: number;
    name: string;
    status: string;
    species: string;
  };
};
