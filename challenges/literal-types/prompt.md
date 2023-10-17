## The Problem Literal Types Solve

JavaScript, like most programming languages has a concept of [primitive data types](todo-primitive-data-types).  Primitive data types are things like `string`, `boolean`, `number`, and `object`.

> sidenote: in JavaScript, arrays and functions are actually objects, but that's a topic for another time :)

But TypeScript isn't _like_ most programming languages.  It's better.  It takes takes things to the next level by introducing _literal_ data types.

You can think of literal data types as being an infinite set of subsets of their primitive counterparts.  For example

### A Practical Use-Case

Literal types can be used to create a rainbow of possibilities.  In this case, we've defined a type `RainbowColor` that can only have one of the types specified in a union of literal strings.

```ts
type RainbowColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'indigo' | 'violet';
```

Then, we can use this type in a function to ensure bad values are not passed in:

```ts
function pickColor(color: RainbowColor): void {
  console.log(`I choose the color ${color}!`);
}

// no error: TypeScript is happy!
pickColor('yellow');

// Error: Argument of type 'purple' is not assignable to parameter of type 'RainbowColor'.
pickColor('purple');
// ^?
```

> By the way.  Did you know that purple's not in the rainbow because [there's no "purple" wavelength of light](https://www.youtube.com/results?search_query=purple+is+not+a+color).  It's true.  Our brains fabricate it for us to make sense of paradoxical visual inputs.

### Literal Types For Returns

But wait! There's A LOT more!  Literal types are useful for returns, too.  Check out this code:

```ts
type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

const isItPartyTime = (day: Day) => {
  switch (day) {
    case 'Friday':
    case 'Saturday':
    case 'Sunday':
      return 'definitely party time';

    default:
      return 'prolly lay low for now'
  }
}

isItPartyTime('Monday');
// ^?
```

> /* the above example assumes a 4 day workweek since 4 day workweeks are observed to increase employee productivity.

The _return type_ for this function is _also_ a literal type union.  Notice that you didn't have to specify the return type anywhere.  It just _works_ this way in TypeScript.  Nice.

### Why Are Type Literals Even Necessary?

If you're thinking to yourself:

> Why are type literals even necessary?  Lots of languages don't have anything like this and they seem to get along just fine with primitive types like `string` and `number` and `boolean`.

The TLDR; is: once you pair type unions with literals, you can start _descriminating_ inputs based on one particular literal instance of a type versus another, TypeScript suddenly becomes capable of doing some pretty amazing static analysis on your code that you could never do if all you had were primitive types.  If that's unpalatable to you, there's always COBOL.  Try that out instead maybe?

## Solving this Challenge

In this prompt we talked mostly about string literals, but there are more kinds:

- number literals
  - (including fractional numbers)
- boolean literals
- function literals
- object literals

Take a look at the tests and see if you can create some type literals that will satisfy the tests.
