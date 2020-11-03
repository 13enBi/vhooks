import { onMounted, onUnmounted, reactive, toRefs, watch } from 'vue';
import ResizeObserver from 'resize-observer-polyfill';
import { getTargetElement, extend } from './utils';

import { Target } from './utils';
import { Ref } from 'vue';

interface ElementSize {
	width: number;
	height: number;
}

const getInitSize = (target: Target): ElementSize => {
	const el = getTargetElement(target) as Ref<HTMLElement>;

	return {
		width: el.value.clientWidth,
		height: el.value.clientHeight,
	};
};

const useResizeObserver = (target: Target) => {
	const size = reactive(getInitSize(target));

	onMounted(() => {
		const el = getTargetElement(target) as Ref<HTMLElement>;

		const resizeObserver = new ResizeObserver((entries) => {
			const { clientWidth: width, clientHeight: height } = entries[0].target;

			extend(size, { width, height });
		});

		watch(
			el,
			(newEl, oldEl) => {
				if (!newEl) return;

				resizeObserver.observe(newEl);
				if (oldEl) {
					resizeObserver.unobserve(oldEl);
				}
			},
			{ immediate: true }
		);

		onUnmounted(() => resizeObserver.disconnect());
	});

	return toRefs(size);
};

export default useResizeObserver;
