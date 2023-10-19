/**
 * These types are used in the editor instance.
 * Essentially, utility types to help test / debug code
 * based on: https://github.com/type-challenges/type-challenges/blob/main/utils/index.d.ts
 */
export const libSource = `
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false;
type Expect<T extends true> = Equal<T, true>;
type ExpectFalse<T extends false> = Equal<T, false>;
type FalseCases<T extends readonly false[]> =
  Equal<T[number], false> extends true
  ? IsTuple<T> extends true
    ? true
    : false
  : false;
type IsAny<T> = 0 extends (1 & T) ? true : false;
type IsNever<T> = [T] extends [never] ? true : false;
type IsTuple<T> =
  IsNever<T> extends true
  ? false
  : T extends readonly unknown[]
    ? number extends T["length"]
      ? false
      : true
    : false
;
type IsTuple<T> =
  IsNever<T> extends true
  ? false
  : T extends readonly unknown[]
    ? number extends T["length"]
      ? false
      : true
    : false
;
type IsUnionInternal<T, Copy = T> =
  [T] extends [never] // IsNever check
    ? false
    : T extends never // force distributivity
      ? false
      : [Copy] extends [T] // distributed union equality check
        ? false
        : true
;
type IsUnknown<T> =
  [unknown] extends [T]
  ? IsAny<T> extends true
    ? false
    : IsNever<T> extends true
      ? false
      : true
  : false;
type NotEqual<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? false : true;
type TrueCases<T extends readonly true[]> =
  false extends Equal<T[number], true>
  ? false extends IsTuple<T>
    ? false
    : true
  : true;
`;
