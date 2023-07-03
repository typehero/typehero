/**
 * These types are used in the editor instance.
 * Essentially, utility types to help test / debug code
 * based on: https://github.com/type-challenges/type-challenges/blob/main/utils/index.d.ts
 */
export const libSource = `
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false

type MergeInsertions<T> =
  T extends object
    ? { [K in keyof T]: MergeInsertions<T[K]> }
    : T

type Alike<X, Y> = Equal<MergeInsertions<X>, MergeInsertions<Y>>

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

type NoInfer<T> = [T][T extends any ? 0 : never];

type IsUnion<T, U = T> = [T] extends [never]
	? false
	: T extends unknown
	? [U] extends [T]
		? false
		: true
	: false;


/** 
 * Helper function to test your code.
 * 
 * Checks if two types have all the same properties and modifiers
 * 
 * To check what it is failing, you can hover over \`Equal\` and see what the types failing are
 */
declare function Equal<A, B>(...args: Alike<A, B> extends true ? [] : [msg: "not equal"]): void;

/** 
 * Helper function to test your code.
 * 
 * Checks if type \`A\` extends \`B\`
 * 
 * To check what it is failing, you can hover over \`Extends\` and see what the types failing are
 */
declare function Extends<A, B>(...args: A extends B ? [] : [msg: [A, "doesn't extend", B]]): void;
`;
