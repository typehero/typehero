## Organize Santa's List

_\[The elves walk into work early on the morning of December 5th. A sign that reads "we're all about passion, not just paychecks" hangs above the entrance to the factory floor.\]_

It's been a tough year for Santa's workshop. The elves are a little behind schedule on getting Santa his list. Santa _reallly really_ likes to see the full list of names far in advance of Christmas Eve when he makes his deliveries.

Normally the elves get lists like this

```ts
const badList = ['Tommy', 'Trash', 'Queen Blattaria' /* ... many more ... */];
const goodList = ['Jon', 'David', 'Captain Spectacular' /* ... many more ... */];
```

And they copy-pasta all the values into a TypeScript type to provide to Santa like this

```ts
type SantasList = [
  'Tommy',
  'Trash',
  'Queen Blattaria' /* ... many more ... */,
  'Jon',
  'David',
  'Captain Spectacular' /* ... many more ... */,
];
```

But there's a problem.. There's one elf on the team, Frymagen, that constantly reminds the others how incredible his Vim skills are. So he has always done it in years past. However this year, Frymagen got one of those MacBook Pros without the escape key and his Vim speed is drastically reduced. We need to find a better way to get Santa his list.

Let's implement `SantasList` such that it can be passed the types for the `badList` and `goodList` and it will return a TypeScript tuple with the values of both lists combined.
