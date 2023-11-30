### Christmas Street Suffix Tester 

Santa's elves are working on a special utility to test street names for specific suffixes! They've set up a type called `StreetSuffixTester`, but it needs refining to correctly identify whether a given street name contains a particular suffix.

Here's the initial code you'll start with:

```typescript
type StreetSuffixTester<T, Suffix extends string> = unknown;
```

Your task is to modify the `StreetSuffixTester` type to correctly determine if a given street name contains a specified suffix. The type should return `true` if the street name ends with the provided suffix, and `false` otherwise.

Good luck!
