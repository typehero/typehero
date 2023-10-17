## ideas for future challenges (in no particular order)

- unique-symbol
- functions-with-literal-returns
- curly-curly
- lowercase-o-object
- never
  - unions-with-never
  - intersections-with-never
- unknown
  - unions-with-unknown
  - intersections-with-unknown
- any
  - unions-with-any
  - intersections-with-any
- type-guards (continuing on from type unions)
- compound-string-literals
- mapping-arrays
- array-item-type
- as-const
- generic-function-arguments
- generic-function-constraints
- generic-type-defaults
- tuples
- tuple-labels
- typeof
- indexing-types
- mapping-modifiers https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#mapping-modifiers
- key-remapping-with-as https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as

## TODO

- figure out patching `Pick` out (`noLib`?)
- JSON Schema for metadata.json
- add some kind of tags system to metadata


## random disorganized snippets for later








a good one for strong generics

```ts
const config = {
  apiUrl: 'https://api.example.com',
  apiKey: 'your-api-key',
} as const;

function getConfigValue<K extends keyof typeof config>(key: K) {
  return config[key];
}

const apiUrl = getConfigValue('apiUrl');
```







### Universe 2: with functions

Functions can also take generic _type arguments_ along with their regular JavaScript-land arguments.

```ts
const createRow = <T>(row: {
  label: string;
  value: T;
  disabled: boolean;
}) => {
  // ... do things
}
```

This syntax might look a little funky at first, but if you stand back and squint a bit, you'll see that it's just a mashup of the regular argument syntax and the type generic syntax we saw above.
















const characters = {generic-constraints
  ironMan: {
    name: 'Tony Stark',
    age: 53,
    attributes: ['genius', 'billionaire', 'playboy', 'philanthropist']
  },
  thor: {
    name: 'Thor Odinson',
    age: 1500,
    attributes: ['Asgardian', 'God', 'thunder'],
  },
  hulk: {
    name: 'Bruce Banner',
    age: 44,
    attributes: ['gamma-irradiated', 'scientist']
  },
  captainAmerica: {
    name: 'Steve Rogers',
    age: 105,
    attributes: ['super-soldier', 'strong'],
  },
  blackWidow: {
    name: 'Natasha Romanoff',
    age: 34,
    attributes: ['master spy', 'martial artist'],
  },
  spiderMan: {
    name: 'Peter Parker',
    age: 19,
    attributes: ['agile', 'web-slinging'],
  },
}













type StarWarsCharacter = {
  [id: string]: {
    fullName: string;
    species: string;
    // ...imagine many more properties
  }
};

const starWarsCharacters: StarWarsCharacter = {
  luke: { fullName: "Luke Skywalker", species: "Human" },
  yoda: { fullName: "Yoda", species: "Unknown" },
  chewy: { fullName: "Chewbacca", species: "Wookiee" },
  // ...imagine many more characters
};

type SpeciesByCharacterId<T extends StarWarsCharacter> = {
  [Id in keyof T]: T[Id]["species"]
};