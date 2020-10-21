import { customRef } from "vue";
import useDebounceFn from "./useDebounceFn";

import { DebonunceOpts } from "./useDebounceFn";

const useDebouncedRef = <T>(value: T, wait = 0, options?: DebonunceOpts) =>
    customRef((track, trigger) => {
        const [set] = useDebounceFn(
            (newVal: T) => {
                value = newVal;
                trigger();
            },
            wait,
            options
        );

        return {
            get: () => (track(), value),
            set,
        };
    });

export default useDebouncedRef;
