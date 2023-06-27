// GENERIC TS HELPERS

export type ValueType = string | boolean | number;

export type Tail<T extends unknown[]> = T extends [infer Head, ...infer Tail]
  ? Tail
  : never;
