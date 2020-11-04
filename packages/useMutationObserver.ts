import { getTargetElement, isArray } from './utils';
import { onUnmounted, ref } from 'vue';
import useMounted from './useMounted';

import { Target } from './utils';
import { Ref } from 'vue';

const useMutationObserver = (
	target: Target | Target[],
	cb: MutationCallback,
	{ ...options }: MutationObserverInit = { childList: true }
) => {
	const ob = ref<MutationObserver | null>(null);

	const handler = () => {
		ob.value = new MutationObserver(cb);
		const els = isArray(target) ? target.map((el) => getTargetElement(el)) : [getTargetElement(target)];

		(els as Ref<Element>[]).forEach((item) => item.value && ob.value!.observe(item.value, options));

		onUnmounted(() => {
			ob.value!.disconnect();
			ob.value = null;
		});
	};

	useMounted(handler);

	return ob;
};

export default useMutationObserver;
