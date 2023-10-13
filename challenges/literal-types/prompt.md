## The Problem Literal Types Solve

> Some forewarning on this challenge..
>
> In isolation TypeScript type literals are not really that useful.  The power of literals is unlocked by other TypeScript features (like [`typeof`](todo-typeof), [type unions](todo-type-unions), and [compound strings](todo-compound-string-literals)) that deeply depend on type literals in order to work.  Type literals are important building blocks, so don't be discouraged if this particular challenge feels a bit academic.  Keep going and you'll find that type literals unlock many extremely practical superpowers.

JavaScript, like most programming languages has a concept of "primitive" data types.  Primitive data types are things like `string`, `boolean`, `number`, and `object`.


> sidenote: in JavaScript, arrays and functions are actually objects, but that's a topic for another time :)

Let's say we've been baking chocolate chip cookies as a side-hustle and we wanna take things to the next level.  To get to industrial scales, we're gonna need to start writing down our recipes.

We might make some variables like this:

```js
const name = 'chocolate chips';
const inStock = true;
const kilograms = 5;
```

Or, better yet, we might wrap them all in an object:

```js
const chocolateChips = {
  name: 'chocolate chips',
  inStock: true,
  kilograms: 5,
}
```

TypeScript has built-in _types_ that represent all of these primitive data types.

```ts
const name: string = 'chocolate chips';
const inStock: boolean = true;
const kilograms: number = 5;

interface Ingredient {
  name: string;
  inStock: boolean;
  kilograms: number;
}

const chocolateChips: Ingredient = {
  name: 'chocolate chips',
  inStock: true,
  kilograms: 5,
}
```

You can also create [type aliases](todo-needs-link) for primitive types:

```ts
type Name = string;
type InStock = boolean;
type Kilograms = number;

interface Ingredient {
  name: Name;
  inStock: InStock;
  kilograms: Kilograms;
}
```

But there's a problem.  Actually there are lots of problems that literal types solve but let's just look at one of them.

Let's say you have a function like this:

```ts
const needToOrderMore = (ingredient: Ingredient) => {
  if (ingredient.kilograms < 100) {
    return true;
  }
  return false;
}
```

## Using Literal Types

```ts
type Name = 'chocolate chips';
type InStock = true;
type Kilograms = 5;

interface Ingredient {
  name: 'chocolate chips';
  inStock: true;
  kilograms: 5;
}
```

### Why Is This Even Necessary?

You might be thinking to yourself:

> Why is this even necessary?  Lots of languages don't have anything like this and they seem to get along just fine.

It's a great question, but to answer it we need one more concept: _type unions_.

Take a look at the [type unions](todo-needs-link) challenge.

> The TLDR; is: once you can start _descriminating_ inputs based on one particular literal instance of a type versus another, TypeScript suddenly becomes capable of doing some pretty amazing static analysis on your code that you could never do if all you had were primitive types.

## Solving this Challenge

In this challenge you'll create some TypeScript literal types.
