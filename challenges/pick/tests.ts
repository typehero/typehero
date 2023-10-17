interface Pokemon {
  name: string;
  type: string;
  hitPoints: number;
  stage: string;
  evolutionStage: number;
  attacks: string[];
  weakness: string;
  resilience: string;
}

const pickYourPokemon = (pokemon: Pick<Pokemon, 'name' | 'type'>) => {
  const { type, name } = pokemon;
  return `You picked the ${type}-type Pokemon ${name}!`;
};

const pikachu = {
  name: 'Pikachu',
  type: 'Electric',
};

console.log(pickYourPokemon(pikachu));
// => `You picked the Electric-type Pokemon Pikachu!`

/** Selecting an invalid property should be an error. */
const pokemonAttacks = (
  // @ts-expect-error
  pokemon: Pick<Pokemon, 'attacks' | 'age'>,
) => {
  return 'Oops! WE ';
};

/** It's also totally fine to select a single property */
const recallPokemon = (pokemon: Pick<Pokemon, 'name'>) => {
  return `You recalled ${pokemon.name}!`;
};
