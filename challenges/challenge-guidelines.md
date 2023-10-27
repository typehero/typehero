<!-- omit in toc -->

# TypeHero Challenge Guidelines

- [Writing `prompt.md`](#writing-promptmd)
  - [Keep It Fun](#keep-it-fun)
  - [Encourage Healthy Practices](#encourage-healthy-practices)
- [Writing `test.ts`](#writing-testts)
  - [`Expect<Equal<` Type Order](#expectequal-type-order)
  - [Avoid Type Tuples](#avoid-type-tuples)
  - [Say _Why_ An Error Occurs](#say-why-an-error-occurs)
- [Writing `user.ts`](#writing-userts)
  - [Don't Use `any`, Prefer `unknown`](#dont-use-any-prefer-unknown)
  - [Avoid "Leading The Witness"](#avoid-leading-the-witness)

This is a guide to help you write a challenge for TypeHero. Our goal is to keep the writing process straightforward while at the same time having some consistency. We've learned from experience that there are a few useful things to do to make it a more consistent (and less chaotic) feeling experience for our users. Some of these things are arbitrary design choices. That's ok. It's not about a "right way of doing things" but more "a cohesive experience for users".

In general, if you find yourself having to pick between:

1. more work for yourself when writing the challenge
1. more work for users when taking the challenge

You should prefer more work for yourself at a 10,000:1 ratio.

## Writing `prompt.md`

### Keep It Fun

Try to keep them fun and find widely relatable pop-culture references (without getting political or anything like that). Things like movies, video games, music, art, and anything a large number of people are likely to be familiar with. If you can work in some kind of interesting and lesser-known science fact or something that can also help the reader feel more engaged.

### Encourage Healthy Practices

Avoid using `T` and `U` and `S` as generic parameters names. That doesn't mean there's never a place for them. Just avoid it if you can. For SUPER generic types (like `Pick`), it's fine to use `T`.

## Writing `test.ts`

### `Expect<Equal<` Type Order

Make sure that the thing that's in the `Expect<Equal<` block _first_ is the thing _the user writes_.

<table>
<thead>
<tr>
<th>:white_check_mark: Do :white_check_mark:</th>
<th>:x: Don't :x:</th>
</tr>
</thead>
<tbody>
<tr>
<td>

```ts
type test_TheCoolestCarEverMade = Expect<Equal<TheCoolestCarEverMade, 'Toyota Corolla'>>;
```

</td>
<td>

```ts
type test_TheCoolestCarEverMade = Expect<Equal<'Toyota Corolla', TheCoolestCarEverMade>>;
```

</td>
</tr>
</tbody>
</table>

### Avoid Type Tuples

Don't use constructions like this:

<table>
<thead>
<tr>
<th>:white_check_mark: Do :white_check_mark:</th>
<th>:x: Don't :x:</th>
</tr>
</thead>
<tbody>
<tr>
<td>

```ts
type test_MyThing1 = Expect<Equal<MyThing1, 'thing 1'>>;
type test_MyThing2 = Expect<Equal<MyThing2, 'thing 2'>>;
type test_MyThing3 = Expect<Equal<MyThing3, 'thing 3'>>;
type test_MyThing4 = Expect<Equal<MyThing4, 'thing 4'>>;
```

</td>
<td>

```ts
type tests = [
  Expect<Equal<MyThing1, 'thing 1'>>;
  Expect<Equal<MyThing2, 'thing 2'>>;
  Expect<Equal<MyThing3, 'thing 3'>>;
  Expect<Equal<MyThing4, 'thing 4'>>;
]
```

</td>
</tr>
</tbody>
</table>

Why? Well what if you have a problem where only `MyThing3` is failing, if the test is written with a tuple type it's really difficult to debug the computed result of `MyThing3` that without taking `MyThing3` out and assigning it to an alias. That's a pretty bad experience for users. We can do that work for them upfront.

Time to get comfortable with multicursor editing!

### Say _Why_ An Error Occurs

When you have a test that is intentionally checking for an error, like

```ts
// @ts-expect-error
type test_MyThing_string = MyThing<string>;
```

try to add a little description:

```diff
- // @ts-expect-error
+ // @ts-expect-error `MyThing` has a generic constraint that should reject strings
type test_MyThing_string = MyThing<string>;
```

## Writing `user.ts`

### Don't Use `any`, Prefer `unknown`

Unless your challenge is related to `any`, avoid using it. That means you should every helper type equal to `unknown` (not `any`).

<table>
<thead>
<tr>
<th>:white_check_mark: Do :white_check_mark:</th>
<th>:x: Don't :x:</th>
</tr>
</thead>
<tbody>
<tr>
<td>

```ts
type Split = unknown;
```

</td>
<td>

```ts
type Split = any;
```

</td>
</tr>
</tbody>
</table>

### Avoid "Leading The Witness"

One goal of TypeHero is to keep things as real-world as possible (except in the case of challenges that are literally just "for science" like JSON parsers, etc.). That means that you want to give people as much on-the-ground experience as possible. You want users to leave a challenge feeling like they actually learned or accomplished something (or both!).

We want to encourage good behaviors that will carry users into their daily work.

<table>
<thead>
<tr>
<th>:white_check_mark: Do :white_check_mark:</th>
<th>:x: Don't :x:</th>
</tr>
</thead>
<tbody>
<tr>
<td>

```ts
type Split = unknown;
```

</td>
<td>

```ts
type Split<S> = unknown;
```

```ts
type Split<S extends string> = unknown;
```

```ts
type Split<S> = S extends /* your code here */
```

</td>
</tr>
</tbody>
</table>
