import throttle from "lodash.throttle";
import { Func } from "./utils";

export interface ThrottleOpts {
	leading?: boolean;
	trailing?: boolean;
}

const useThrottleFn = <T extends Func>(
	fn: T,
	wait = 0,
	options?: ThrottleOpts
): [(...args: any[]) => ReturnType<T>, () => void] => {
	const run = throttle(fn, wait, options);

	return [run as any, run.cancel];
};

export default useThrottleFn;
