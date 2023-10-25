type LiteralString = 'chocolate chips';
type LiteralTrue = true;
type LiteralNumbers = 1 | 2 | 3 | 4 | 5 | 6;
type LiteralObject = {
  name: 'chocolate chips',
  inStock: true,
  kilograms: 5,
};
type LiteralFunction = (a: number, b: number) => number;

const literalString = 'Ziltoid the Omniscient';
const literalTrue = true;
const literalNumber = Math.random() > 0.5 ? 1 : 2;
const literalObject = {
  origin: "far across the omniverse",
  command: "fetch",
  item: "the universe's ultimate cup of coffee (black)",
  time: "five Earth minutes"
};
const literalFunction = (a: number, b: string) => a || b;
