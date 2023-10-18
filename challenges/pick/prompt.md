## The Problem `Pick` Solves

`Pick` is a very useful helper type that allows you to create a type by using an existing type as a starting point.

Say, for example, your codebase has a type that looks like this:

```ts
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
```

That's a lot of properties!  But what if you have a function that only needs two properties from this type:

```ts
const pickYourPokemon = (pokemon: Pokemon) => {
  const { type, name } = pokemon;

  return `You picked the ${type}-type Pokemon ${name}!`
}
```

You would call your function like this:

```ts
const pikachu = {
  name: 'Pikachu',
  type: 'Electric',
}
console.log(pickYourPokemon(pikachu))
//                          ^------ oops! There's a type-error here!

```

But now there's a type error because you didn't provide the full `Pokemon` type.

As you can see, this function requires the full `Pokemon` type, even though your function only actually uses half of properties of the full `Pokemon` type.

How can you make this easier?

### Exploring Your Options

You could always hardcode the object directly into the function

```diff
- const pickYourPokemon = (pokemon: Pokemon) => {
+ const pickYourPokemon = (pokemon: { name: string, type: string }) => {
```

You might also be tempted to separate all the things you need into two positional arguments.

```diff
- const pickYourPokemon = (pokemon: Pokemon) => {
+ const pickYourPokemon = (name: string, type: string) => {
```

But there's a much better way!  You can use the `Pick` utility type!  You simply to provide  the keys you want from the original type and it produces a new type for your specific use-case.

This is great news because it means:

1. Any time something in the base `Pokemon` type changes, it'll also be updated in your function.  If you hardcoded, they'd fall out of sync.
1. You don't have to repeat yourself!
1. You are communicating to future readers that your function is using a subset of the types from `Pokemon`.
1. Consumers of your `pickYourPokemon` function don't need to provide data the function doesn't even use (that would be annoying, wouldn't it?).

## How To Use `Pick`

`Pick` is a special _built-in_ TypeScript type that's always in scope, so you don't need to import it from anywhere.  You can just use it as-if it was already imported.

To use it, you must provide `Pick` with two things:

1. The type original object you're basing your new type on (in our example, `Pokemon`)
1. A _union_ of strings representing all the keys you wish to pick from the base type (in our case, `name` and `type`).

Let's talk about the `union` part real quick.  TypeScript has a special syntax that represent an unordered unique set of values.  You separate them with the "pipe" character.

In our example, we have a union of strings.  It looks like this:

```ts
type BasicPokemonKeys = 'name' | 'type';
```

Then we can use this type with `Pick` and our `Pokemon` base type:

```ts
type BasicPokemonInfo = Pick<Pokemon, BasicPokemonKeys>
```

We're almost there!

A few things about your options fo the syntax here.  We made the `BasicPokemonKeys` helper type, but we didn't have to.  We can declare the type _inline_ like this:

```ts
type BasicPokemonInfo = Pick<Pokemon, 'name' | 'type'>
```

Then, we can use this new type in our function definition:

```diff
- const pickYourPokemon = (pokemon: Pokemon) => {
+ const pickYourPokemon = (pokemon: BasicPokemonInfo) => {
```

Just like we inlined the keys, we could also inline the entire `Pick` itself.  In fact, this style is what you'll most often see in TypeScript codebases in a situation like this.  Here's a full example:

```ts
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

const pickYourPokemon = (
  pokemon: Pick<Pokemon, 'name' | 'type'>
) => {
  const { type, name } = pokemon;
  return `You picked the ${type}-type Pokemon ${name}!`
}

const pikachu = {
  name: 'Pikachu',
  type: 'Electric',
}

console.log(pickYourPokemon(pikachu))
// => `You picked the Electric-type Pokemon Pikachu!
```

## Solving This Challenge

In this challenge you'll implement the `Pick` type described above.

Remember that the TypeScript `keyof` operator is the way of getting the keys of a type.  So `keyof Pokemon` will result in a union of strings that looks like `'name' | 'type'  ...... | 'weakness' | 'resilience'`.

By convention, the first argument of the `Pick` type is the base type (so, `Pokemon` in our example) and the second generic argument is a union of strings of that are valid keys of the base type.

Another convention is the use of `T` and `K` as parameter types.  For extremely generic types like `Pick` this is normal.  As your types become more specific you should try to make more descriptive names.
