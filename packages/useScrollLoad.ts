import { nextTick, onMounted, reactive, toRefs } from "vue";
import { getTargetElement, getPreCountChild } from "./utils";
import useIntersectionObserver from "./useIntersectionObserver";

import { Ref } from "vue";
import { Target, Func } from "./utils";

interface ScrollLoadOps {
	preCount?: number;
}

const useScrollLoad = (target: Target, load: Func, options: ScrollLoadOps = {}) => {
	const { preCount = 1 } = options;

	const status = reactive({
		loading: false,
		nomore: false,
	});

	onMounted(async () => {
		const el = getTargetElement(target) as Ref<Element>;

		if (!el.value) return;

		let obEl = getPreCountChild(el.value, preCount);

		while (!obEl) {
			await nextTick();
			obEl = getPreCountChild(el.value, preCount);
		}

		const handler = async (entries: IntersectionObserverEntry[]) => {
			const { isIntersecting, target } = entries[0];

			if (!isIntersecting || status.loading) return;

			io.unobserve(target);

			status.loading = true;
			await load();
			status.loading = false;

			const nextObEl = getPreCountChild(el.value, preCount);

			if (nextObEl && nextObEl != target) {
				io.observe(nextObEl);
			} else {
				status.nomore = true;
			}
		};

		const io = useIntersectionObserver(obEl, handler);
	});

	return toRefs(status);
};

export default useScrollLoad;
