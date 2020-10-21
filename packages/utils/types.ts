import { Ref, WatchSource } from "vue";

export * from "./dom";
export type Deps = WatchSource | Readonly<Array<WatchSource<unknown> | object>> | Record<string, any>;
export type Getter<T> = T | ((...args: any) => T);
export type PromiseType<P extends Promise<any>> = P extends Promise<infer T> ? T : never;
export type RefType<R extends Ref<any>> = R extends Ref<infer T> ? T : never;
export type Func = (...args: any) => any;
export type TimeOut = ReturnType<typeof setTimeout>;
export type Noop = () => void;
export type WrapRef<T> = T | Ref<T>;
