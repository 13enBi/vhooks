import { reactive, onMounted, toRefs } from 'vue';
import { extend } from './utils';
import useEventListener from './useEventListener';

import { Target } from './utils';

export interface Position {
	top: number;
	left: number;
}

const useScroll = (target?: Target) => {
	const position = reactive<Position>({
		top: NaN,
		left: NaN,
	});

	onMounted(() => {
		useEventListener(
			'scroll',

			(event: Event) => {
				let { target: currTarget } = event;
				if (!currTarget) return;
				if (currTarget === document) currTarget = document.scrollingElement;

				const { scrollLeft: left, scrollTop: top } = currTarget as HTMLElement;

				extend(position, { left, top });
			},

			{ target, defaultTarget: document }
		);
	});

	return toRefs(position);
};

export default useScroll;
