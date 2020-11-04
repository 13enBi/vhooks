import 'intersection-observer';
import { getTargetElement, isArray } from './utils';
import { onUnmounted, ref } from 'vue';
import useMounted from './useMounted';

import { Target } from './utils';
import { Ref } from 'vue';

const useIntersectionObserver = (
	target: Target | Target[],
	cb: IntersectionObserverCallback,
	{ root, ...options }: Omit<IntersectionObserverInit, 'root'> & { root?: Target } = {}
) => {
	const ob = ref<IntersectionObserver | null>(null);

	const handler = () => {
		const els = isArray(target) ? target.map((el) => getTargetElement(el)) : [getTargetElement(target)],
			rootEl = getTargetElement(root, document) as Ref<Element>;

		ob.value = new IntersectionObserver(cb, { ...options, root: rootEl.value });

		(els as Ref<Element>[]).forEach((item) => item.value && ob.value!.observe(item.value));

		onUnmounted(() => {
			ob.value!.disconnect();
			ob.value = null;
		});
	};

	useMounted(handler);

	return ob;
};

export default useIntersectionObserver;
