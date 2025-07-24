import { assertExists } from "@std/assert";

export function mustExist<T>(value: T | null | undefined, msg?: string): T {
  assertExists(value, msg);
  return value;
}
