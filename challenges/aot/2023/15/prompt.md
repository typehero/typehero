### Box The Toys!

Santa's elves are packing toys into boxes based on the quantity requested. They need your help to create a TypeScript type called `BoxToysByQuantity<T, N extends number>` that will organize toys in boxes based on the toy type `T` and the quantity `N`.

Here's the initial code you'll start with:

```typescript
type BoxToysByQuantity<T, N extends number> = unknown;
```

The type should generate a union of tuples, where each tuple contains the specified number of toy elements.


Good luck!
