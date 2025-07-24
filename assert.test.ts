import { assertEquals, assertThrows } from "@std/assert";
import { asExists, asInstanceOf, asRecord, mustExist } from "./assert.ts";

Deno.test("asExists", () => {
  assertThrows(() => asExists(null));
  assertThrows(() => asExists(undefined));
  assertEquals(asExists(123), 123);
  assertEquals(asExists, mustExist);
});

Deno.test("asInstanceOf", () => {
  class Foo {
    a: number;
    constructor(a: number) {
      this.a = a;
    }
  }
  class Bar {}

  const foo = new Foo(123);
  assertEquals(asInstanceOf(Foo, foo), foo);
  assertThrows(() => asInstanceOf(Bar, foo));

  // check the type
  const _asBar: () => Bar = () => asInstanceOf(Bar, foo);
});

Deno.test("asRecord", () => {
  const foo = {};
  assertEquals(asRecord(foo).bar, undefined);
  assertThrows(() => asRecord(0).bar);
});
