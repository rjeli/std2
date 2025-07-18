import { assertExists, unreachable } from "@std/assert";

// type ResponseBody = NonNullable<ConstructorParameters<typeof Response>[0]>;
type ResponseBody = string | Blob | ArrayBuffer | ArrayBufferView;

function isResponseBody(x: unknown): x is ResponseBody {
  return typeof x === "string" ||
    x instanceof Blob ||
    x instanceof ArrayBuffer ||
    ArrayBuffer.isView(x);
}

type Arg = ResponseBody | Iterable<unknown>;
type Ret<A extends Arg> = [A] extends [ResponseBody] ? Uint8Array
  : [A] extends [Iterable<infer Item>] ? Item
  : never;

export function readableStreamFrom<A extends Arg>(
  x: A,
): ReadableStream<Ret<A>> {
  if (isResponseBody(x)) {
    const resp = new Response(x);
    assertExists(resp.body);
    return resp.body as ReadableStream<Ret<A>>;
  }
  if (x?.[Symbol.iterator]) {
    const iter = x[Symbol.iterator]();
    return new ReadableStream({
      pull(ctl) {
        const { done, value } = iter.next();
        if (done) {
          ctl.close();
        } else {
          ctl.enqueue(value as Ret<A>);
        }
      },
    });
  }
  unreachable();
}
