import { onUnmounted, Ref, watch } from 'vue';
import { getTargetElement, isArray } from './utils';

import { Target, TargetElement, Func } from './utils';

interface Options {
	target?: Target;
	defaultTarget?: TargetElement;
	capture?: boolean;
	once?: boolean;
	passive?: boolean;
}

type Params = [string | string[], Func | Func[], (Options | undefined)?];

const normalize: (...args: Params) => any = (eventName, callback, options) => {
	const normalizeMap: Record<string, Func> = {
		'11'(target, type) {
			(eventName as string[]).forEach((ev: string, index) => {
				target[type](ev, (callback as Func[])[index], options);
			});
		},

		'10'(target, type) {
			(eventName as string[]).forEach((ev: string) => {
				target[type](ev, callback as Func, options);
			});
		},

		'01'(target, type) {
			(callback as Func[]).forEach((fn: Func) => {
				target[type](eventName as string, fn, options);
			});
		},

		'00'(target, type) {
			target[type](eventName as string, callback as Func, options);
		},
	};

	return (target: HTMLElement | void, type: 'addEventListener' | 'removeEventListener' = 'addEventListener') => {
		if (!target) return;

		normalizeMap[+isArray(eventName) + (+isArray(callback) + '')](target, type);
	};
};

const useEventListener: (...args: Params) => void = (
	eventName,
	callback,
	{ target, defaultTarget = window, ...options } = {}
) => {
	const el = getTargetElement(target, defaultTarget) as Ref<HTMLElement>;

	const handler = normalize(eventName, callback, options);

	watch(
		el,
		(newTarget, oldTarget) => {
			handler(oldTarget, 'removeEventListener');
			handler(newTarget, 'addEventListener');
		},
		{ immediate: true }
	);

	onUnmounted(() => {
		handler(el.value, 'removeEventListener');
	});
};

export default useEventListener;
