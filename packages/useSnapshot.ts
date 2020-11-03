import { ref, unref, computed } from 'vue';
import { isFunction, isNumber } from './utils';

import { Ref, WritableComputedRef } from 'vue';
import { Noop, WrapRef } from './utils';

const slice = <T>(arr: T[], index: number, add: T) => {
	return [...arr.slice(0, index ? index + 1 : void 0), add];
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
		index = ref(0);

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

			const nextIdx = index.value + step,
				len = snapshots.value.length - 1;

			index.value = nextIdx < 0 ? 0 : nextIdx > len ? len : nextIdx;
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
