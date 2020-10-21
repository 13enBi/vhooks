import { customRef, unref, ref } from "vue";

import { Ref } from "vue";
import { WrapRef } from "./utils";

const useNumRangeRef = (num: number, { max, min }: { max: WrapRef<number>; min: WrapRef<number> }): Ref<number> => {
	if (max === void 0 && min === void 0) {
		console.warn("must provide Maximum and Minimum");

		return ref(num);
	}

	return customRef((track, trigger) => {
		max = parseFloat(unref(max) as any);
		min = parseFloat(unref(min) as any);

		return {
			get: () => (track(), num),
			set(newNum) {
				num = Math.min(max as number, Math.max(min as number, newNum));
				trigger();
			},
		};
	});
};

export default useNumRangeRef;
