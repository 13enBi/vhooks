import debounce from "lodash.debounce";
import { Func } from "./utils";

export interface DebonunceOpts {
	leading?: boolean;
	trailing?: boolean;
}

const useDebounceFn = <T extends Func>(
	fn: T,
	wait = 0,
	options?: DebonunceOpts
): [(...args: any[]) => ReturnType<T>, () => void] => {
	const run = debounce(fn, wait, options);

	return [run as any, run.cancel];
};

export default useDebounceFn;
