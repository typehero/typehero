type test_age = Expect<NotLiteral<number, typeof age>>;
type test_name = Expect<NotLiteral<string, typeof name>>;

/** this is just a helper type to sus out literals */
type NotLiteral<T, U> =
  1 extends (T extends U ? U extends T ? 1 : 2 : 3)
  ? true
  : false
