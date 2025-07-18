import { assert, assertEquals } from "@std/assert";

// we ignore a match that continues to the end of the chunk
// one could imagine writing a "streaming" regex transform
// so we could know whether further matches are possible.
// see https://stackoverflow.com/a/41580048
export class RegexStream extends TransformStream<string, string> {
  #re: RegExp;
  #buf: string = "";

  constructor(re: string | RegExp) {
    const transform = (
      chunk: string,
      ctl: TransformStreamDefaultController,
      flush: boolean,
    ) => {
      this.#buf += chunk;
      assertEquals(this.#re.lastIndex, 0);
      let lastIndex = 0;
      while (true) {
        const m = this.#re.exec(this.#buf);
        if (m === null) {
          break;
        }
        if (!flush && this.#re.lastIndex === this.#buf.length) {
          // we matched up to the end, it's possible we will get more.
          this.#re.lastIndex = 0;
          break;
        }
        lastIndex = this.#re.lastIndex;
        ctl.enqueue(m[0]);
      }
      this.#buf = this.#buf.slice(lastIndex);
    };

    super({
      transform: (chunk, ctl) => transform(chunk, ctl, false),
      flush: (ctl) => transform("", ctl, true),
    });

    const src = re instanceof RegExp ? re.source : re;
    const flags = new Set(re instanceof RegExp ? re.flags : "");
    flags.add("g");
    assert(!flags.has("y"), "should not have sticky flag");
    this.#re = new RegExp(src, [...flags].join(""));
  }
}
