import { customRef } from "vue";
import useThrottleFn from "./useThrottleFn";

import { ThrottleOpts } from "./useThrottleFn";

const useThrottleRef = <T>(value: T, wait = 0, options?: ThrottleOpts) =>
	customRef((track, trigger) => {
		const [set] = useThrottleFn(
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

export default useThrottleRef;
