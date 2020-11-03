import { ref, watch, readonly } from 'vue';
import { isFunction } from './utils';

import { Ref } from 'vue';

const usePrevious = <T>(initRef: Ref<T>, filter: (pre?: T, next?: T) => boolean = () => true): Readonly<Ref<T>> => {
	const preRef = ref(initRef.value) as Ref<T>;

	watch(initRef, (next, pre) => {
		if (isFunction(filter) && filter(pre, next)) {
			preRef.value = pre;
		}
	});

	return readonly(preRef) as Readonly<Ref<T>>;
};

export default usePrevious;
