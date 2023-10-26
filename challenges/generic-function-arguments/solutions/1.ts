const identity = <T,>(input: T) => input;

const mapArray = <T, U>(arr: T[], fn: (item: T) => U) => arr.map(fn);