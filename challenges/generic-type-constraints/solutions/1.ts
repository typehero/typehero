type AllowString<T extends string> = T;
type AllowNumber<T extends number> = T;

type CreateLogger<T extends (a: number) => void> = {
  log: T;
  exit: () => void;
};
