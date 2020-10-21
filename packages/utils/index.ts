import { Func } from "./types";

export * from "./types";

export const isArray = Array.isArray;

export const isObject = (val: unknown): val is Record<string, any> =>
	val != null && typeof val === "object" && isArray(val) === false;

export const isFunction = (val: unknown): val is Function => typeof val === "function";

export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
	return val instanceof Promise && isFunction(val.then) && isFunction(val.catch);
};

export const isString = (val: unknown): val is string => typeof val === "string";

export const isNumber = (val: unknown): val is number => typeof val === "number";

export const isBoolean = (val: unknown): val is boolean => typeof val === "boolean";

export const extend = Object.assign;

export const NOOP = () => {};

export const pipe = (...fns: Func[]) => (...args: any[]) => fns.forEach((fn) => isFunction(fn) && fn(...args));

export const timeOut = (delay: number) =>
	new Promise((resolve) => {
		setTimeout(resolve, delay);
	});

export const hasKey = (obj: object, key: string | symbol): key is keyof typeof obj => key in obj;

const hasOwnProperty = Object.prototype.hasOwnProperty;
export const hasOwnKey = (obj: object, key: string | symbol): key is keyof typeof obj => hasOwnProperty.call(obj, key);
