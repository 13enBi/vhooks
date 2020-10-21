import { watch, WatchOptions } from "vue";
import useThrottleFn from "./useThrottleFn";

import { ThrottleOpts } from "./useThrottleFn";
import { Deps, Func } from "./utils";

export default (
    deps: Deps,
    fn: Func,
    { wait = 0, leading = false, trailing = true, ...watchOpts }: ThrottleOpts & WatchOptions & { wait?: number } = {}
) => {
    [fn] = useThrottleFn(fn, wait);

    return watch(deps, fn, watchOpts);
};
