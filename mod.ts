/**
 * An extended standard library for my tools.
 * @module
 */

export * from "./streams/regex.ts";
export * from "./streams/json.ts";

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
