/**
 * An extended standard library for my tools.
 * @module
 */

export type * from "./types.ts";

export * from "./assert.ts";
export * from "./streams/regex.ts";
export * from "./streams/json.ts";

export const run: <T>(f: () => T) => T = (f) => f();

export function defer(fn: () => unknown): AsyncDisposable {
  return {
    async [Symbol.asyncDispose]() {
      await fn();
    },
  };
}

export function scoped<T extends object>(
  value: T,
  cleanup: (value: T) => unknown,
): T & AsyncDisposable {
  return new Proxy(value, {
    get(target, prop, receiver) {
      if (prop === Symbol.asyncDispose) {
        return async () => await cleanup(value);
      }
      return Reflect.get(target, prop, receiver);
    },
  }) as T & AsyncDisposable;
}
