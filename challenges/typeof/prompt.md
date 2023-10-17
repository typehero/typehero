## `typeof`: A Bridge Between Worlds

Have we said thank you, yet, for taking these TypeHero challenges?  Well... THANK YOU!

You're doing yourself a great service by improve your knowledge of TypeScript.  As you dig deeper, on your quest to become a TypeScript wizard, you're going to start noticing that there are almost two worlds.  The "JavaScript" world and the "types" world.

| | JavaScript world | types world |
| - | - | - |
| variables | `const`, `let`, function arguments | [type aliases](todo-type-aliases), [default generic arguments](todo-default-generic-arguments) |
| operations | `for` loops, `while` loops, recursion, higher-order functions | recursion, higher-order types |
| runtime artifacts  | ✅ | ❌ |
| time of error | runtime | compile time |
| constructs | statements, expressions | expressions |

Perhaps you see a problem this divide might cause.  What happens if you have information in JavaScript that you want to bring over to TypeScript?

<!-- TODO: mermaid diagram https://github.blog/2022-02-14-include-diagrams-markdown-files-mermaid with a remark plugin in `markdown.tsx` -->

```text
raw data
|              conversion
|              |            types
|              |            |
v              v            v
JavaScript ==> `typeof` ==> TypeScript
```

## How to use `typeof`

### `typeof` in JavaScript

You might be familiar with `typeof` as a JavaScript operator.  It returns a string indicating the type of a JavaScript value.

```ts
console.log(typeof "Euler's Number");
// -> logs the string `'string'`

console.log(typeof 2.7182);
// -> logs the string `'number'`
```

But that's JavaScript.  The `typeof` actually also exists in TypeScript!

### `typeof` in TypeScript

What if we wanted to use some of our data as a type in TypeScript?

```ts
const name = "Euler's Number";
const value = 2.7182;

// we can use `typeof` for type aliases
type Value = typeof value;

// or we can use it inline for new 
interface FamousNumbers {
  label: typeof name;
  value: Value;
}
```

```ts
const count = 42;
type Count = typeof count;
```

### `typeof` Is Most Useful For Complex Types

TypeScript keyword that you put before a JavaScript _identifier_ like a variable name.  Let's say you have this function in your codebase:

```ts
const createPoint = (x: number, y: number) => ({ x, y });
```

You can use `typeof` to _extract_ the type of this JavaScript function and bring it into the realm of TypeScript types:

```ts
//                        JavaScript stuff
//                        |
//                        v----------
type CreatePoint = typeof createPoint
//^----------------------
//|
//|TypeScript stuff
```

Later, you're going to learn about ways to then do more operations on types.  We're going to be extracting [keys of objects](todo-pick), and creating new types for [return types](todo-return-types) and [parameters](todo-parameters) of functions.

## Solving This Challenge

The tests provide you some data.  Try to make all the tests pass by using that data combined with the `typeof` operator.
