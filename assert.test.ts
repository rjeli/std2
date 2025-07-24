import { assertEquals, assertThrows } from "@std/assert";
import { mustExist } from "./assert.ts";

Deno.test("it works", () => {
  assertThrows(() => mustExist(null));
  assertThrows(() => mustExist(undefined));
  assertEquals(mustExist(123), 123);
});
