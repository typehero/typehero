type GroceryList = {
  [groceryItem: string]: number;
};

type InnapropriateActionBySituation = {
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
