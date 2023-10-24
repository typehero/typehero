# TypeHero Challenge Guidelines

This is a guide to help you write a challenge for TypeHero.  Our goal is to keep the writing process straightforward while at the same time having some consistency.  We've learned from experience that there are a few useful things to do to make it a more consistent (and less chaotic) feeling experience for our users.  Some of these things are arbitrary design choices.  That's ok.  It's not about a "right way of doing things" but more "a cohesive experience for users".

In general, if you find yourself having to pick between:

1. more work for yourself when writing the challenge
1. more work for users when taking the challenge

You should prefer more work for yourself at a 10,000:1 ratio.

## Writing The Prompt

### Keep It Fun

Try to keep them fun and find widely relatable pop-culture references (without getting political or anything like that).  Things like movies, video games, music, art, and anything a large number of people are likely to be familiar with.

### Encourage Healthy Practices

Avoid using `T` and `U` and `S` as generic parameters names.  That doesn't mean there's never a place for them.  Just avoid it if you can.  For SUPER generic types (like `Pick`), it's fine to use `T`.

## Writing the tests

### Test Code Conventions

### `Expect<Equal<`

make sure that the thing that's in the `Expect<Equal<` block _first_ is the thing _the user writes_.

| Do | Don't |
| - | - |
| `Expect<Equal<TheCoolestCarEverMade, "Toyota Corolla">>` | `Expect<Equal<"Toyota Corolla", TheCoolestCarEverMade>>` |

### Avoid Type Tuples

Don't use constructions like this:

<table>
<thead>
<tr>
<th>Do</th>
<th>Don't</th>
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

It's if you have a problem where only `MyThing3` is failing, it's presently really difficult to debug that without taking `MyThing3` out and assigning it to an alias.  That's a pretty bad experience for users.  We can do that work for them upfront.

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

## Writing the user code

### User Code Conventions

### Don't Use `any`, prefer `unknown`

Unless your challenge is related to `any`, avoid using it.  That means you should every helper type equal to `unknown` (not `any`)

### Avoid "leading the witness"

One goal of TypeHero is to keep things as real-world as possible (except in the case of challenges that are literally just "for science" like JSON parsers, etc.).  That means that you want to give people as much on-the-ground experience as possible.  You want users to leave a challenge feeling like they actually learned or accomplished something (or both!).

We want to encourage good behaviors that will carry users into their daily work.

<table>
<thead>
<tr>
<th>Do</th>
<th>Don't</th>
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
