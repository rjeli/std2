import { FixedChunkStream } from "@std/streams/unstable-fixed-chunk-stream";
import { assertEquals } from "@std/assert";

import { RegexStream } from "./regex.ts";

type Case = readonly [string, string[]];

const tests: { re: RegExp; cases: Case[] }[] = [
  {
    re: /\b\d+/,
    cases: [
      ["", []],
      ["123 4567 8 9", ["123", "4567", "8", "9"]],
      ["1 1 1     foo 2", ["1", "1", "1", "2"]],
    ],
  },
];

const chunkSizes = [1, 4, 32];

Deno.test("it works", async () => {
  for (const t of tests) {
    for (const [input, expected] of t.cases) {
      for (const cs of chunkSizes) {
        const stream = new Response(input)
          .body!.pipeThrough(new FixedChunkStream(cs))
          .pipeThrough(new TextDecoderStream())
          .pipeThrough(new RegexStream(t.re));
        const actual = await Array.fromAsync(stream);
        assertEquals(actual, expected);
      }
    }
  }
});
