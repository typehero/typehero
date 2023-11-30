### Christmas Present Delivery

Santa needs your help creating a TypeScript type for the Present Delivery List! Initially, there's a type defined for an `Address` and an empty `PresentDeliveryList`:

```typescript
type Address = { address: string; city: string };
type PresentDeliveryList = unknown;
```

Your task is to define a TypeScript generic type named `PresentDeliveryList` that takes in another generic `BehaviorList`. The `BehaviorList` represents a list of children along with their behaviors (either 'good' or 'bad'). The `PresentDeliveryList` should map each child's behavior to their corresponding `Address`.

Here's a test case that your `PresentDeliveryList` type needs to pass:

```typescript
type MixedBehaviorList = {
  john: { behavior: 'good' };
  jimmy: { behavior: 'bad' };
  sara: { behavior: 'good' };
  suzy: { behavior: 'good' };
  chris: { behavior: 'good' };
  penny: { behavior: 'bad' };
};

type test_MixedBehaviorTest = Expect<
  Equal<
    PresentDeliveryList<MixedBehaviorList>,
    {
      john: Address;
      jimmy: Address;
      sara: Address;
      suzy: Address;
      chris: Address;
      penny: Address;
    }
  >
>;
```

Good luck!
