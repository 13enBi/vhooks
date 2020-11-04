import { unref, watchEffect } from 'vue';

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

	watchEffect((onInvalidate) => {
		timer = setInterval(fn, unref(interval));

		onInvalidate(stop);
	});

	options.immediate && run();

	return [run, stop];
};

export default useInterval;
