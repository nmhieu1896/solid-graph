export {};
declare global {
  type Point = {
    x: number;
    y: number;
  };

  type Prettify<T> = {
    [K in keyof T]: T[K];
  } & {};
}
