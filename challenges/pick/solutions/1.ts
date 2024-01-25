/**
 * From T, pick a set of properties whose keys are in the union K
 *
 * This solution is verbatim from the ES5 builtins.
 */
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};
