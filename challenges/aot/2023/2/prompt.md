### The Gift Wrapper

Santa's workshop needs an updated type for gift wrappers! Currently, there's a basic type defined as follows:

```typescript
type GiftWrapper = {
  present: any;
  from: any;
  to: any;
};
```

Your task is to create a type named `GiftWrapper` that takes in three type parameters: `Present`, `From`, and `To`. The goal is to modify the existing `GiftWrapper` type to enforce specific types for each property based on the provided type parameters.

Good luck!
