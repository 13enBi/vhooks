import { reactive, toRefs } from "vue";
import useEventListener from "./useEventListener";
import { extend } from "./utils";

const useResize = () => {
	const size = reactive({
		width: NaN,
		height: NaN,
	});

	useEventListener("resize", () => {
		const { clientWidth: width, clientHeight: height } = document.documentElement;

		extend(size, { width, height });
	});

	return toRefs(size);
};

export default useResize;
