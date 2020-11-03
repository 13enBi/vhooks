import { customRef, unref, ref } from "vue";

import { Ref } from "vue";
import { WrapRef } from "./utils";

const useNumRangeRef = (num: number, { max, min }: { max: WrapRef<number>; min: WrapRef<number> }): Ref<number> => {
	if (max === void 0 && min === void 0) {
		console.warn("must provide Maximum and Minimum");

		return ref(num);
	}

	return customRef((track, trigger) => {
		return {
			get: () => (track(), num),
			set(newNum) {
				num = Math.min(unref(max), Math.max(unref(min), newNum));
				trigger();
			},
		};
	});
};

export default useNumRangeRef;
