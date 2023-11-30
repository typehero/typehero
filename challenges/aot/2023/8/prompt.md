### Santa's Naughty List Filter Puzzle

Santa's workshop needs a type that filters out misbehaving people from his list. You're provided with an initial type:

```typescript
type RemoveMisbehavingPeople<T> = unknown;
```

Your task is to create a TypeScript type `RemoveMisbehavingPeople<T>` that filters out entries from an object where the property key is prepended with `naughty_`. 

Good luck!
