### Help Santa Rebuild His 'Hood

Santa lost his hoods(toy sacks) while delivering presents, but luckily, he still has his notebooks! Help him rebuild his hoods using the information from his notebooks. 🎁 represents presents he has to deliver, and 🧦 are socks he received in return.

```typescript
type Rebuild<T> = unknown;
```

Here are Santa's notebooks and the corresponding hoods he wants to rebuild:

```typescript
type SantasNotebook1 = [2, 1, 3, 3];
type SantasNotebook2 = [3, 3, 2, 1];
type SantasNotebook3 = [2, 3, 3, 1];

type SantasHood1 = ['🎁', '🎁', '🧦', '🎁', '🎁', '🎁', '🧦', '🧦', '🧦'];
type SantasHood2 = ['🎁', '🎁', '🎁', '🧦', '🧦', '🧦', '🎁', '🎁', '🧦'];
type SantasHood3 = ['🎁', '🎁', '🧦', '🧦', '🧦', '🎁', '🎁', '🎁', '🧦'];
```

Your challenge is to create a TypeScript type named `Rebuild` that takes in Santa's notebook as an array of numbers and returns the corresponding rebuilt hood as an array of strings, adhering to the provided test cases.

Can you build the `Rebuild` type so that it reconstructs Santa's hoods accurately based on the information in his notebooks? Once solved, the type should pass the test cases provided.

Good luck and have fun helping Santa reconstruct his hoods!
