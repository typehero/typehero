## Protect the List

Santa's elves are working on a special type to protect Santa's list. They've started with a basic type structure:

```typescript
type SantaListProtector<T> = any;
```

Your task is to define the `SantaListProtector<T>` type to create a read-only version of the provided type `T`. The read-only version should retain the same structure as `T`, but all properties and nested properties should be marked as `readonly`.

Good luck!