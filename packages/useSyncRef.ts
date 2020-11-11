import { Ref, watch, WatchOptions } from 'vue';
import { isArray } from './utils';

const useSyncRef = <T extends Ref<any>>(
	source: T,
	targets: T | T[],
	watchOptions: WatchOptions = { immediate: true, flush: 'sync' }
) => {
	!isArray(targets) && (targets = [targets]);

	return watch(source, (newVal) => (targets as T[]).forEach((t) => (t.value = newVal)), watchOptions);
};

export default useSyncRef;
