## What Problem Do Type Aliases Solve?

![mars_climate_orbiter](https://www.simscale.com/wp-content/uploads/2017/12/Mars_Climate_Orbiter_768.jpg)

Did you know that a 125 _million_ dollar robotic space probe, the Mars Climate Orbiter, crashed into Mars because of a simple units conversion.

Let's envision that code in TypeScript and see how type aliases can help.

```ts
/**
 * calculates landing thrusters based on distance from landing site
 */
const landSpacecraft = (distance: number) => {
  // ... do fancy math here
}
```

In this case, wouldn't it be nice if we could use a type that's more specific than `number`?

Well.. We can!

Here's how it looks:

```ts
/** International System of Units Meter */
type Meters = number;

const landSpacecraft = (distance: Meters) => {
  // ... do fancy math here
}
```

Cool, huh?  Now we can do fun stuff like adding JSDoc (as you see above) that way people will see more information about how this type is intended to be _used_ in programs.

## The Biggest Source Of Bugs With Aliases

But unfortunately, this particular TypeScript types design might not be a great choice for such a job because the actual behavior may be surprising to you.  You might expect the following code to have a type error, but it doesn't:

```ts
/** In */
type Miles = number;

const targetDistance: Miles = 100;

landSpacecraft(targetDistance);
```

Wait!  What's going on?  `landSpacecraft` specifically asked for `Meters` but clearly we passed in `Miles` here.  Our spacecraft is going to crash!

Be careful that you understand that TypeScript is a _structural type system_.  One result of this is that primitive types are _not_ something known as ["opaque types"](https://en.wikipedia.org/wiki/Opaque_data_type).  To TypeScript, everything that's an alias for a number is still a number.

There actually is a idiomatic TypeScript way to design this, but it requires another concept covered in another challenge [`type-unions`](TODO-link).

## How To Create Type Aliases

To create a new type alias you simply use the `type` TypeScript keyword followed by a space, then the name of your type (usually beginning with a capital letter), another space, an equals sign, a final space and then the _stuff_ you want to alias.

```ts
type MyAlias = number;
```

It's most common (but not mandatory) to use a semicolon to end a type declaration.

Don't worry if this TypeScript feature seems underwhelming.  It's not that useful _on its own_, but rather it becomes very powerful when you pair it with other concepts (like type unions, literal types, intersections, and more).

### p.s. Don't Overuse Aliases

One little tip: be careful not to _over use_ type aliases.  A very common example is that you may be tempted to write something like this:

```ts
export interface Row {
  id: string;
  displayed: boolean;
  selectable: boolean;
  label: string;
  expanded: boolean;
}

export type Rows = Row[];
```

That might seem nice because you can just import `Rows` and use it somewhere in your app where you have an array of Rows.  But avoid doing this.  You can just import `Row` and specify `Row[]` when you use it.  This is beneficial because it's simpler to read and immediately understand but also because it gives you access to the `Row` type, which you're probably going to want to work with _anyway_.

## Solving This Challenge

To solve this challenge, make type aliases for `Name`, `Year`, `Payload`, etc. until there are no errors in the tests.

`Name` is started here for you as an example.
