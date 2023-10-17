## The Problem Generic Type Constraints Solve

Generics are an incredibly powerful tool in TypeScript.  In a [previous challenge](todo-generic-type-arguments) where generic type arguments were introduced, we compared them to function arguments _but for types_.

Consider the parallel of these two:

```ts
//             v-----v argument identifier
const drive = (carType: CarType) => {
  //                  ^-------^ argument type constraint
  // ....
}

//        v-------v type parameter identifier
type Drive<CarType> = (carType: CarType) => {
  // ....
}
```

Notice that there's no type constraint for the type parameter identifier.

That means that if we make a type like this:

```ts

type Row<T> = {
  value: T;
  label: string;
  orientation: 'vertical' | 'horizontal';
};
```

A consumer of this type could pass literally _anything_ for Row.  All of these would be valid:

```ts
type BooleanRow = Row<boolean>;
type RegexRow = Row<RegExp>;
type RowRowRowStringRow = Row<Row<Row<Row<string>>>>;
type VoidFuncRow = Row<() => void>;
```

But our Row component is likely to not be written in such a way to handle _literally anything_ being passed in as a type.  We need to set some static boundaries on what kinds of things are passed in for `T` to `Row`.

_We need types for our types._

Well.  That's kinda what Generic type constraints are: _type constraints for your parameterized types_!

It's a mouthful, but let's break it down step by step.

## Using Generic Constraints

So, let's say that our component is advanced enough to handle three things:

- `string`: a row with a string value
- `number`: a row with a numeric value
- `() => string | number`: a row with a lazily evaluated value that can itself be a string or a number

Let's make a type alias for our constraints:

```ts
type RowConstraints = string | number | (() => string | number);
```

> Note: Function type notation must be parenthesized when used in a union type (otherwise it might be ambiguous).

To tell TypeScript that we only want to allow `Row` to accept types that fall into one of these categories we specified in `RowConstraints` we use the `extends` keyword.

```ts
type Row<T extends RowConstraints> = {
  value: T;
  label: string;
  orientation: 'vertical' | 'horizontal';
}
```

Now, if we try to use our `Row` generic with anything that doesn't match the above, TypeScript will report an error:

<!-- TODO: twoslash error below -->

```ts
type StringArrayRow = Row<string[]>;
//                        ^?
```

## Solving This Challenge

Let the tests guide you on what specific constraints each type needs.  By the end of this challenge, it should start to feel pretty robotic to add type constraints.
