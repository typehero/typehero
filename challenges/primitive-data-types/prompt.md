## The Problem Primitive Data Types Solve

Because the ability to create primitive types are the foundational idea behind TypeScript, asking what problem primitive types solve is more like asking "what problem does _TypeScript_ solve".

TypeScript is like a really really smart spellchecker.  It helps you work faster when you're at your best, but it also saves you from misspelling words when you're under stress at 3am the night before a big term paper is due.

Think about it for a second: spellcheckers work because there are encoded with rules about the vocabulary and syntax of English.  Similarly, TypeScript has advanced knowledge about the vocabulary and syntax of JavaScript.  But TypeScript can do even better because you can specify the type of your data.  That allows TypeScript to make even better judgement calls about whether something you're trying to do is likely to be a bug (or not).

## What Does "Primitive" mean in this context?

And speaking of words and language, the usage of "primitive" in this sense is a bit of technical jargon.  If you look up "primitive" in the dictionary you'll find that the top definition is:

> 1. relating to, denoting, or preserving the character of an early stage in the evolutionary or historical development of something.

So basically, it means "ancient" or "undeveloped"?  huh???

Nope.  That's actually not the way the word is used in this context.  If you keep reading down the list, you'll find a less common definition:

> 3. not developed or derived from anything else.

Ahhh. Yes.  That one makes more sense.  That's what primitive types are.  They are the base units of information from which everything else is derived.

Indeed, all TypeScript types are derived from primitive types (aside from a few very very rare exceptions most people are not even aware of\*).

> \* if you're incredibly curious: a very short list of exceptions that the compiler has special knowledge of do exist.  E.g. usages `intrinsic` keyword and `ThisType`.

## What Do Primitive Types Look Like

It's a bit confusing at first, but primitive types are defined with _lowercase_ letters.

Here are some of the basic types:

- `number`: since JavaScript only has one real number type (IEEE-754 64-bit floating point numbers), so too does TypeScript then not define types like `short` and `long` or types like `uint32` or `uint16` like you might be used to in other languages.  Instead we just use `number` for everything.
- `string`: a variable length set of characters (UTF-16).
- `boolean`: Don't let this next sentence keep you up at night if it sounds strange, but just keep in the back of your mind that boolean isn't actually a primitive type deep down in TypeScript internals.  It's a little different from string or number since it is just an alias for the union of `true` and `false`.  It doesn't _widen_ like `number` and `string` do, and thus is slightly inconsistent.  If that didn't make sense to you right now don't worry.  This problem almost never surfaces in a way that's problematic so you're clear to just consider it a primitive type.  Also, the way TypeScript handles `boolean` is actually the more correct way to model things from a ["Set theory"](https://en.wikipedia.org/wiki/Set_theory) standpoint.
- `null`: this is technically really a "literal type", but it refers to the type of the `null` value in JavaScript.  Since `null` is special, it get's its own type.
- `undefined`: same as with `null`.  This is a specific JavaScript value and it has a corresponding TypeScript type.

Then we've got some more advanced ones that you don't need to worry about quite yet.  But here they are as a teaser:

- `symbol`
- `bigint`
- `object`
- `never`
- `unknown`
- `any`

And while we're in the weeds for a moment, you should be aware that _capitalized_ variants of these things do actually exist: `Number`, `String`, `Boolean`, `Symbol`, `Object`.  But these refer to something quite different (i.e. JavaScript global objects) and should virtually never be used as types.

## Solving This Challenge

To solve this challenge: add primitive types to the code until the errors go away.

You might need to add type annotations to variables (declared with `const` or types of arguments).  You might also need to add missing properties to objects.
