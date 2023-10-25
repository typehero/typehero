import { Expect, Equal } from 'type-testing';

/** temporary */
const expect = <T>(a: T) => ({
  toEqual: (b: T) => a === b
});

const identity_string = identity("this is a string");
expect(identity_string).toEqual("this is a ...");
type test_identity_string = Expect<Equal<
  typeof identity_string,
  string
>>;

const identity_number = identity(123.45);
expect(identity_number).toEqual(123.45);
type test_identity_number = Expect<Equal<
  typeof identity_number,
  number
>>;

const identity_boolean = identity(false);
expect(identity_boolean).toEqual(false);
type test_identity_boolean = Expect<Equal<
  typeof identity_boolean,
  boolean
>>;

const strings = ['1', '1', '2', '3', '5'];
const numbers = [1, 1, 2, 3, 5];

const stringsToNumbers = mapArray(strings, str => parseInt(str));
expect(stringsToNumbers).toEqual(numbers);
type test_stringsToNumber = Expect<Equal<
  typeof stringsToNumbers,
  number[]
>>;

const numbersToStrings = mapArray(numbers, num => `${num}`);
expect(numbersToStrings).toEqual(strings)
type test_numbersToStrings = Expect<Equal<
  typeof numbersToStrings,
  string[]
>>;

const numbersToNumbers = mapArray(numbers, num => num + 1);
expect(numbersToNumbers).toEqual([2, 2, 3, 4, 6])
type test_numbersToNumbers = Expect<Equal<
  typeof numbersToNumbers,
  number[]
>>;

const stringsToStrings = mapArray(strings, str => `${str}!`);
expect(stringsToStrings).toEqual(['1!', '1!', '2!', '3!', '5!'])
type test_stringsToStrings = Expect<Equal<
  typeof stringsToStrings,
  string[]
>>;
