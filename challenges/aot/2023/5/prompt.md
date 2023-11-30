### Organize Santa's List

Santa's elves are working on organizing Santa's list, and they need your help in creating a TypeScript type to merge and sort the good and bad lists for the year. Currently, there's a type defined with placeholders:

```typescript
type SantasList<GoodList, BadList> = any;
```

Your challenge is to modify the `SantasList` type so that it concatenates the `GoodList` and `BadList` types.

Here's a test case that your `SantasList` type must pass:

```typescript
// Your task: Define the SantasList type here to pass the test cases

// Test cases
const bads = ['tommy', 'trash'] as const;
const goods = ['bash', 'tru'] as const;

type cases = [
  // Test cases here
];

// This should throw a TypeScript error
// @ts-expect-error
type error = SantasList<null, undefined>;
```

Good luck!
