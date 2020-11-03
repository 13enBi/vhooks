import { isRef, unref, watch } from 'vue';

import { WrapRef } from './utils';

const useInterval = <T extends Function>(fn: T, interval: WrapRef<number>, options = { immediate: false }) => {
	let timer: number;

	const run = () => {
			clearInterval(timer);
			fn();
			timer = setInterval(fn, unref(interval));
		},
		stop = () => {
			clearInterval(timer);
		};

	if (isRef(interval)) {
		watch(interval, (newInterval) => {
			clearInterval(timer);
			timer = setInterval(fn, newInterval);
		});
	}

	options.immediate && run();

	return [run, stop];
};

export default useInterval;
