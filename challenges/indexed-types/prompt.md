## What Indexed Types Are For

Indexed types allow you to look inside other types. They're a useful tool when accessing array/tuple values, object values, and more! We're going to see much more complicated uses for indexed types, but for this challenge, let's just focus on the basics.

## How To Use Index Types

### Arrays

Just how you can use a number index to grab an element of an array:

```ts
const cars = ['Bugatti', 'Ferarri', 'Lambo', 'Porsche', 'Toyota Corolla'];
const secondCar = cars[1];
```

You can do exactly the same thing with types;

```ts
type Cars = ['Bugatti', 'Ferarri', 'Lambo', 'Porsche', 'Toyota Corolla'];
type SecondCar = Cars[1];
//   ^?
```

> Notice that TypeScript evaluates the literal value `"Ferarri"`. It's not just `string`!

### Objects

Same for objects:

```ts
const donations = {
  Bono: 15_000_000,
  'J.K. Rowling': 160_000_000,
  'Taylor Swift': 45_000_000,
  'Elton John': 600_000_000,
  'Angelina Jolie and Brad Pitt': 100_000_000,
};
const eltonDonations = donations['Elton John'];
```

and (you guessed it!) object types:

```ts
type Donations = {
  Bono: 15_000_000;
  'J.K. Rowling': 160_000_000;
  'Taylor Swift': 45_000_000;
  'Elton John': 600_000_000;
  'Angelina Jolie and Brad Pitt': 100_000_000;
};

type EltonDonations = Donations['Elton John'];
//   ^?
```

> Notice that TypeScript evaluates the literal value for Elton's donations. It's not just `number`!

### Strings

If you're getting excited that you might be able to do the same for strings, I have somewhat bad news for you, unfortunately.

The following is valid TypeScript

```ts
const question = 'Have the humans delivered their ultimate cup of coffee?';
const firstCharacter = question[0];
```

And this is also valid:

```ts
type Question = 'Have the humans delivered their ultimate cup of coffee?';
type FirstCharacter = Question[0];
//   ^?
```

But perhaps you notice a difference from the above examples that returned a literal type. Here, with TypeScript strings, the resultant value is just `string` and not a more specific constant value like `H` (the first character of the string type). That means that while it's not a syntax error to index a string type, it also effectively _does nothing_ since it will always result in `string`.

In fact, TypeScript doesn't even check (or care about) the specific value you index with. You'll always get back string:

```ts
type Empty = '';
type IndexEmpty = Empty[9001];
//   ^?
```

Not a big deal or anything, but just something to be aware of in case you were expecting a different behavior.

> _spoiler alert_: there actually _ARE_ ways to index a string and return a particular character, but ends up involving some quite advanced type machinery. Check out the [First Character](todo-first-character) challenge if you're curious.

## Solving This Challenge

This one should feel easy to pass. Let the tests guide you.

And, remember, while this challenge is pretty straightforward to complete, we're soon going to be doing some pretty advanced work that relies heavily on indexed types.

Onward!
