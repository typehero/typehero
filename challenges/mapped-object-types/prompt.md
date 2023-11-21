## Why Mapped Object Types Are Useful

In mathematics, a "map" is a function that associates each element in one set with an element. That's where we get this usage of the word in computer science.

Mapped types are one of the most potent and versatile features of TypeScript. They enable you to create new types by transforming the properties of existing types, making your code more robust, flexible, and maintainable. As you further your journey with TypeScript, you're going to find yourself reaching for mapped types pretty often to solve daily-living type (and data) transformation tasks.

## How To Use Mapped Types

It might seem a little strange, but let's start with a mapped type that _does nothing_. Here's how it looks:

```ts
type MoviesByGenre = {
  action: 'Die Hard';
  comedy: 'Groundhog Day';
  sciFi: 'Blade Runner';
  fantasy: 'The Lord of the Rings: The Fellowship of the Ring';
  drama: 'The Shawshank Redemption';
  horror: 'The Shining';
  romance: 'Titanic';
  animation: 'Toy Story';
  thriller: 'The Silence of the Lambs';
};

type MovieInfoByGenre<T> = {
  [K in keyof T]: T[K];
};

type Example = MovieInfoByGenre<MoviesByGenre>;
```

Let's talk about what this syntax does, piece by piece:

- `type` begins a type declaration.
- `MovieInfoByGenre` is the name we gave to our type
- `<T>` defines generic parameter we named `T`
- `= {` begins our type
- `[` starts an index signature
- `K` is the name we're giving to the value in this index signature.
  - `K` (for "Key") and `P` (for "Property") are very common names to use in this particular situation. While it's not often the best choice, you'll see it around (including in TypeScript's own builtin types), so it's worthwhile to just roll with it if you see it. If you can make a more descriptive name, you should.
- `in` is a special TypeScript operator for mapping. It tells TypeScript that `K` represents a single item in a larger set of things defined on the right side of the `in` operator.
- `keyof T` is a union of all the keys of the `T` object.
- `: T[K]` is regular type indexing. The value, `K`, can here be thought of as a singular property in a sort of loop. We take some individual value of `K` (which are keys of `T`) and then index `T` with that key, thereby producing a value that matches the value in `T` for that `K`.
- `;` it might at first seem strange, but if you take a step back, this is just a `property: value` line in an object type, so we end it with a semicolon like we normally would with types in TypeScript.
- `};` ends the type declaration.

But, all this _stuff_ but we end up with a type that's literally identical to what we started with. In the above code, `Example` and `MoviesByGenre` are literally the same type to TypeScript because TypeScript is a structural type system. They have all the same properties and values, so to TypeScript they are basically aliases at this point (aliases with extra steps, granted!).

### Resetting all values

So let's do the simplest possible thing to change our `Example` type. Let's just change one little part of the above:

```diff
type MovieInfoByGenre<T> = {
- [K in keyof T]: T[K];
+ [K in keyof T]: boolean;
};
```

Can you picture what our `Example` type would be if we made this change?

It would look like this:

```ts
type Example = {
  action: boolean;
  comedy: boolean;
  sciFi: boolean;
  fantasy: boolean;
  drama: boolean;
  horror: boolean;
  romance: boolean;
  animation: boolean;
  thriller: boolean;
};
```

## Solving This Challenge

The tests define a slightly more complicated remapping, but you actually have all the tools you need to make it work. Just take it slow and follow the syntax piece by piece if you get lost.
