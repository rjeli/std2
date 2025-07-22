import { assertEquals, assertObjectMatch } from "@std/assert";
import { delay } from "@std/async";
import { defer, scoped } from "./mod.ts";

Deno.test("defer", async () => {
  const log: string[] = [];
  {
    await using _d0 = defer(() => log.push("A"));
    {
      await using _d1 = defer(() => log.push("B"));
    }
    await using _d2 = defer(() => log.push("C"));
  }
  assertEquals(log, ["B", "C", "A"]);
});

Deno.test("scoped", async () => {
  const log: string[] = [];
  {
    await using x = scoped({ foo: 1234 }, async () => {
      await delay(1);
      log.push("A");
    });
    assertEquals(log, []);
    assertObjectMatch(x, { foo: 1234 });
  }
  assertEquals(log, ["A"]);
});
