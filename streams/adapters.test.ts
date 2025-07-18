import { assertEquals } from "@std/assert";
import { readableStreamFrom } from "./adapters.ts";

Deno.test("it works", async () => {
  // from(string) gives a stream of bytes
  assertEquals(
    (await Array.fromAsync(
      readableStreamFrom("abc").pipeThrough(new TextDecoderStream()),
    )).join(""),
    "abc",
  );
  // from(iterable) just yields from that iterator
  assertEquals(
    await Array.fromAsync(
      readableStreamFrom(["a", "b", "c"]),
    ),
    ["a", "b", "c"],
  );
  assertEquals(
    await Array.fromAsync(
      readableStreamFrom((function* () {
        yield 1;
        yield 2;
        yield 3;
      })()),
    ),
    [1, 2, 3],
  );
});
