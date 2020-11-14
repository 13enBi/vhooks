import { ref, unref, computed } from 'vue';
import { isFunction, isNumber } from './utils';
import useNumRangeRef from './useNumRangeRef';

import { Ref, WritableComputedRef } from 'vue';
import { Noop, WrapRef } from './utils';

const slice = <T>(arr: T[], index: number, add: T) => {
	if (index === 0) {
		return [arr[0], add];
	}

	return [...arr.slice(0, index + 1), add];
};

const useSnapshot = <T>(
	initVal: WrapRef<T>,
	filter: (pre?: T, next?: T) => boolean = () => true
): [
	WritableComputedRef<T>,
	{
		go: (step: number) => void;
		backward: Noop;
		forward: Noop;
		reset: Noop;
	}
] => {
	const snapshots = ref([unref(initVal)]) as Ref<T[]>,
		index = useNumRangeRef(0, { min: 0, max: computed(() => snapshots.value.length - 1) });

	const get = () => snapshots.value[index.value],
		set = (next: T) => {
			if (isFunction(filter) && filter(get(), next)) {
				const nextSnapshots = slice(snapshots.value, index.value, next);
				snapshots.value = nextSnapshots;
				index.value = nextSnapshots.length - 1;
			}
		};

	const current = computed({
		get,
		set,
	});

	const go = (step: number = 0) => {
			if (!isNumber(step)) step = parseInt(step);

			index.value = index.value + step;
		},
		forward = () => go(1),
		backward = () => go(-1),
		reset = () => {
			snapshots.value = [current.value];
			index.value = 0;
		};

	return [current, { go, forward, backward, reset }];
};

export default useSnapshot;
