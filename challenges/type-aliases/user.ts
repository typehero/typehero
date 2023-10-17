// We completed the first alias (`Name`) for you to see as an example
type Name = string;

// Now try replacing `unknown` with a primitive data type that might be appropriate for `Year`
type Year = unknown;

type IsOperational = unknown;

type Payload = {
  name: Name;

  // the tests show that you need a `mass` property here
  // but first you might need to create an alias for `Kilograms`
  // because that's the value of `mass`
};
