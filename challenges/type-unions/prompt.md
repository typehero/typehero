## What Problem Type Unions Solve

In a previous example for `type-aliases` we saw a problem. We were writing code for a space shuttle and we wanted to make sure that we can't accidentally use the wrong units type.

```ts
type Meters = number;
type Miles = number;

const landSpacecraft = (distance: Meters) {
  // ... do fancy math ...
}
```

But we noticed when we call `landSpacecraft` with the wrong literal type (see [the challenge on literal types](https://typehero.dev/challenge/literal-types)), there's no error like we might expect:

```ts
const distanceInMiles: Miles = 1242;
landSpacecraft(distanceInMiles);
```

What do we do? We have some places in our code that take a unit of `miles` and some places in our code that take a unit of `meters` and we want to be sure we _NEVER_ mix the two up since it could mean literally destroying the entire spacecraft if we do (even once).

We can use unions!

## How To Use Type Unions

Unions are defined using a single "pipe" character: `|` separating two types or type aliases.

Let's take a look:

```ts
type Meters = number;
type Miles = number;

type Distance = Meters | Miles;
```

That's a good start, but there's still no way for our function to tell the difference between the two, so we _spruce up_ the first two type aliases a bit.

```ts
type Meters = {
  unit: 'meters';
  value: number;
};

type Miles = {
  unit: 'miles';
  value: number;
};

type Distance = Meters | Miles;
```

Now check out how we can update `landSpacecraft`:

```ts
const landSpacecraft = (distance: Distance) => {
  let meters: Meters = {
    unit: 'meters',
    value: distance.unit === 'miles' ? distance.value / 1609.34 : distance.value,
  };
  // ... rest of our code
};
```

## Properties of Unions

Unions are a very deep topic, actually. The three things you need to know right now are:

1. unions are unordered
   a. and if you implement hacks to try to depend on the order your tests will break across different TypeScript versions
1. the items in a union are unique
   a. so doing `1 | 1 | 2 | 3` is the same as `1 | 2 | 3`
1. the `never` type is an empty union
   a. we'll learn more about `never` [later on](todo-never)

## Solving This Challenge

We just started integrating with a new API from a vendor that only publishes data in `feet`. Now we need to update a function `getDistanceInMeters` accordingly.

Then, context switch to a completely different task (realistic, isn't it??) and update the `Position` type's union members until there are no more errors in the test.
