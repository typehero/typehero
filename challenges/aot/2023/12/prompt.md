### Find Santa 

Santa has lost himself in a forest filled with Christmas trees! Your task is to create a TypeScript type named `FindSanta<T>` that finds the index where Santa appears in an array of emojis representing the forest. The emoji for Santa is 🎅🏼.

Here's the initial code you'll start with:

```typescript
type FindSanta<T, U> = unknown;
```

Your challenge is to update the `FindSanta<T>` type so that it correctly determines the index of 🎅🏼 in the array of emojis representing the forest. Once solved, the type should pass the provided test cases where each forest array corresponds to an emoji array and the expected index where Santa appears (or `never` if Santa is not present).

Good luck finding Santa in the forest!
