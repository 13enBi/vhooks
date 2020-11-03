import { getTargetElement, isArray } from './utils';
import { onUnmounted } from 'vue';

import { Target } from './utils';
import { Ref } from 'vue';

const useMutationObserver = (
	target: Target | Target[],
	cb: MutationCallback,
	options: MutationObserverInit = { childList: true }
) => {
	const ob = new MutationObserver(cb);

	const els = isArray(target) ? target.map((el) => getTargetElement(el)) : [getTargetElement(target)];

	(els as Ref<Element>[]).forEach((item) => item.value && ob.observe(item.value, options));

	onUnmounted(ob.disconnect);

	return ob;
};

export default useMutationObserver;
