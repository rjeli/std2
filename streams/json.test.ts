import { assertEquals } from "@std/assert";
import { readableStreamFrom } from "./adapters.ts";
import { JsonParseStream } from "./json.ts";

Deno.test("it works", async () => {
  const stream = readableStreamFrom(['{"a":1}'])
    .pipeThrough(new JsonParseStream());
  const actual = await Array.fromAsync(stream);
  assertEquals(actual, [{ a: 1 }]);
});
