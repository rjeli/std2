export type Ctor<T = unknown, Args extends unknown[] = unknown[]> = new (
  ...args: Args
) => T;

export type AbstractCtor<T = any, Args extends any[] = any[]> = abstract new (
  ...args: Args
) => T;
