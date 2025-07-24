import { assert, assertExists, assertInstanceOf } from "@std/assert";
import { AbstractCtor } from "./types.ts";

export function asExists<const T>(
  value: T | null | undefined,
  msg?: string,
): T {
  assertExists(value, msg);
  return value;
}

export const mustExist = asExists;

export function asInstanceOf<const C extends AbstractCtor, const U>(
  ctor: C,
  value: U,
): U & InstanceType<C> {
  assertInstanceOf(value, ctor);
  return value;
}

export function asRecord<const T>(value: T): T & Record<PropertyKey, unknown> {
  assert(typeof value === "object" && value !== null);
  return value as any;
}
