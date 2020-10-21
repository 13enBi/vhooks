import { watch } from "vue";

import { WatchCallback, WatchOptions } from "vue";
import { Deps } from "./utils";

const useOnceWatch = (deps: Deps, cb: WatchCallback, options?: WatchOptions) => {
    const stop = watch(
        deps,
        async (...args) => {
            await cb(...args);

            stop();
        },
        options
    );

    return stop;
};

export default useOnceWatch;
