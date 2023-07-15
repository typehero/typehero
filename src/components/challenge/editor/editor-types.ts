/**
 * These types are used in the editor instance.
 * Essentially, utility types to help test / debug code
 * based on: https://github.com/type-challenges/type-challenges/blob/main/utils/index.d.ts
 */
export const libSource = `
type Expect<T extends true> = T
type ExpectTrue<T extends true> = T
type ExpectFalse<T extends false> = T
type IsTrue<T extends true> = T
type IsFalse<T extends false> = T

type NotEqual<X, Y> = true extends Equal<X, Y> ? false : true
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false

// https://stackoverflow.com/questions/49927523/disallow-call-with-any/49928360#49928360
type IsAny<T> = 0 extends (1 & T) ? true : false
type NotAny<T> = true extends IsAny<T> ? false : true

type Debug<T> = { [K in keyof T]: T[K] }
type MergeInsertions<T> =
  T extends object
    ? { [K in keyof T]: MergeInsertions<T[K]> }
    : T

type Alike<X, Y> = Equal<MergeInsertions<X>, MergeInsertions<Y>>

type ExpectExtends<VALUE, EXPECTED> = EXPECTED extends VALUE ? true : false
type ExpectValidArgs<FUNC extends (...args: any[]) => any, ARGS extends any[]> = ARGS extends Parameters<FUNC>
  ? true
  : false

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never
`;
