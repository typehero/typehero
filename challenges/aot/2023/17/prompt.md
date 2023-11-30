### Rock, Paper, Scissors

Let's play Rock-Paper-Scissors in TypeScript! We have a type defined for checking the winner:

```typescript
type WhoWins<Opponent, You> = unknown;
```

Your task is to enhance the `WhoWins` type to correctly determine the winner in a Rock-Paper-Scissors game. The game is represented by three emojis: Rock (👊🏾), Paper (🖐🏾), and Scissors (✌🏽).

Can you create the `WhoWins` type to accurately determine the winner in the Rock-Paper-Scissors game according to the provided test cases? Once solved, the type should correctly identify the result of the game between the two given emojis.

Good luck and may the best emoji win!
