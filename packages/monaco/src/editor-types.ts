/**
 * These types are used in the editor instance.
 * Essentially, utility types to help test / debug code
 * based on: https://github.com/type-challenges/type-challenges/blob/main/utils/index.d.ts
 */
export const libSource = `
type Expect<T extends true> = T;
type ExpectTrue<T extends true> = T;
type ExpectFalse<T extends false> = T;
type IsTrue<T extends true> = T;
type IsFalse<T extends false> = T;

type NotEqual<X, Y> = true extends Equal<X, Y> ? false : true;
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

type IsAny<T> = 0 extends 1 & T ? true : false;
type NotAny<T> = true extends IsAny<T> ? false : true;

type Debug<T> = { [K in keyof T]: T[K] };
type MergeInsertions<T> = T extends object
  ? { [K in keyof T]: MergeInsertions<T[K]> }
  : T;

type Alike<X, Y> = Equal<MergeInsertions<X>, MergeInsertions<Y>>;

type ExpectExtends<VALUE, EXPECTED> = EXPECTED extends VALUE ? true : false;
type ExpectValidArgs<
  FUNC extends (...args: any[]) => any,
  ARGS extends any[]
> = ARGS extends Parameters<FUNC> ? true : false;

type NoInfer<T> = [T][T extends any ? 0 : never];

declare function id<T>(): T;

/**
 * Helper function to test your code.
 *
 * Checks if two types have all the same properties and modifiers
 *
 * To check what it is failing, you can hover over \`Equal\` and see what the types failing are
 */
declare function Equal<A, B>(
  ...args: [
    ...([a: A, b: B] | []),
    ...(Alike<A, B> extends true ? [] : [msg: "not equal"])
  ]
): void;

/**
 * Helper function to test your code.
 *
 * Checks that two types aren't the same
 *
 * To check what it is failing, you can hover over \`NotEqual\` and see what the types failing are
 */
declare function NotEqual<A, B>(
  ...args: [
    ...([a: A, b: B] | []),
    ...(Alike<A, B> extends true ? [msg: "equal"] : [])
  ]
): void;

/**
 * Helper function to test your code.
 *
 * Checks if type \`A\` extends \`B\`
 *
 * To check what it is failing, you can hover over \`Extends\` and see what the types failing are
 */
declare function Extends<A, B>(
  ...args: [
    ...([a: A, b: B] | []),
    ...([A] extends [B] ? [] : [msg: [A, "doesn't extend", B]])
  ]
): void;
`;
