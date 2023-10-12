## The Problem `keyof` solves

The `keyof` operator is used for extracting a union representing the keys (also known as "properties") of a type.

Let's say your audiophile cousin is asking you to digitize her casette tape collection (she's convinced they "sound better" on casette... yawn..).  So you make an object where you count up how many albums you have for each artist:

```ts
const casettesByArtist = {
  'Alanis Morissette': 2,
  'Mariah Carey': 8,
  'Nirvana': 3,
  'Oasis': 2,
  'Radiohead': 3,
  'No Doubt': 3,
  'Backstreet Boys': 3,
  'Spice Girls': 2,
  'Green Day': 2,
  'Pearl Jam': 5,
  'Metallica': 5,
  'Guns N\' Roses': 2,
  'U2': 3,
  'Aerosmith': 4,
  'R.E.M.': 4,
  'Blur': 3,
  'The Smashing Pumpkins': 5,
  'Britney Spears': 3,
  'Whitney Houston': 3,
};
```

But what if you wanted to extract all these keys as a type?  You _certainly_ would not want to retype all those artist names.

You can use `keyof`!

## How To Use `keyof`

`keyof` is special TypeScript syntax that you use before any type.

In our case we _don't have_ a type, so we create one with the `typeof` operator:

```ts
type CasettesByArtist = typeof casettesByArtist;
```

Then we can combine `keyof` with our new type to get an alias that represents the union of all keys in our `casettestByArtist` object.

```ts
type Artists = keyof CasettesByArtist;
```

## What `keyof` _returns_

The result of `keyof` is always a union.

> Even if there are 0 or 1 objects, it doesn't hurt to think of the result as a union.  If there are no elements in the result will be `never` (which is the empty set in "Set theory" terminology).  When there's only one key than the resulting type will be a single primitive or literal type.

## Solving This Challenge

We have a `getCasetteCount` function that should error if it's passed anything other than a valid artist name from your `casettesByArtist` object.

Remember, we don't want to ever have to retype the keys in the `casettesByArtist` object.
