type Scalar = null | boolean | number | string;

type Json<T> = [T] extends [Scalar | undefined] ? Scalar
  : [T] extends [{ [x: number]: unknown }] ? { [K in keyof T]: Json<T[K]> }
  : never;

export class JsonParseStream<T extends Json<T>>
  extends TransformStream<string, T> {
  constructor() {
    super({
      transform: (chunk, ctl) => {
        const json: T = JSON.parse(chunk);
        ctl.enqueue(json);
      },
    });
  }
}
