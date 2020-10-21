import { computed, onMounted, Ref, unref, watchEffect } from "vue";
import { extend, getTargetElement, isNumber } from "./utils";
import useNumRangeRef from "./useNumRangeRef";
import useThrottleFn from "./useThrottleFn";
import useEventListener from "./useEventListener";

import { Target, WrapRef } from "./utils";

export interface VirtualListParams {
	container: Target;
	wrap: Target;
	list: WrapRef<any[]>;
}

export interface VirtualListOptions {
	itemHeight: number | ((index: number, item?: any) => number);
	overscan: number;
}

const useVirtualList = (
	{ container, wrap, list }: VirtualListParams,
	{ overscan = 5, itemHeight }: VirtualListOptions
): [Ref<{ data: any; index: number }[]>, (index: number) => void] => {
	if (!itemHeight) {
		throw "please enter a valid itemHeight";
	}

	const listLength = computed(() => unref(list).length);

	const start = useNumRangeRef(0, { min: 0, max: listLength }),
		end = useNumRangeRef(10, { min: 10, max: listLength });

	const containerEl = getTargetElement(container) as Ref<HTMLElement>,
		wrapEl = getTargetElement(wrap) as Ref<HTMLElement>;

	const getViewCapacity = (containerHeght: number) => {
		if (isNumber(itemHeight)) {
			return Math.ceil(containerHeght / itemHeight);
		} else {
			let sum = 0,
				capacity = 0;

			for (let i = start.value, len = listLength.value; i < len; i++) {
				sum += itemHeight(i, list[i]);

				if (sum >= containerHeght) {
					capacity = i - start.value;
					break;
				}
			}

			return capacity;
		}
	};

	const getOffset = (scrollTop: number) => {
		if (isNumber(itemHeight)) {
			return Math.ceil(scrollTop / itemHeight);
		} else {
			let sum = 0,
				offset = 0;
			for (let i = 0, len = listLength.value; i < len; i++) {
				sum += itemHeight(i, list[i]);

				if (sum >= scrollTop) {
					offset = i + 1;
					break;
				}
			}

			return offset;
		}
	};

	const distanceTopCache: number[] = [];
	const getDistanceTop = (index: number) => {
		if (distanceTopCache[index]) {
			return distanceTopCache[index];
		}

		if (isNumber(itemHeight)) {
			return (distanceTopCache[index] = index * itemHeight);
		} else {
			let height = 0;
			for (let i = 0; i < index; i++) height += itemHeight(i, list[i]);

			return (distanceTopCache[index] = height);
		}
	};

	const calculateRange = () => {
		const el = containerEl.value;
		if (!el) return;

		const { scrollTop, clientHeight } = el;

		const offset = getOffset(scrollTop),
			visibleCount = getViewCapacity(clientHeight);

		start.value = offset - overscan;
		end.value = offset + visibleCount + overscan;
	};

	const sumHeight = computed(() => {
		if (isNumber(itemHeight)) {
			return itemHeight * listLength.value;
		} else {
			return unref(list).reduce((sum, _, index) => {
				return (sum += itemHeight(index, list[index]));
			}, 0);
		}
	});

	const offsetTop = computed(() => getDistanceTop(start.value));

	const [scrollHandler] = useThrottleFn((e: Event) => {
		e.preventDefault();
		calculateRange();
	}, 100);

	onMounted(() => {
		calculateRange();
		useEventListener("scroll", scrollHandler, { target: containerEl.value });

		containerEl.value.style.overflow = "auto";
		wrapEl.value.style.width = "100%";
		watchEffect(() => {
			extend(wrapEl.value.style, {
				height: `${sumHeight.value - offsetTop.value}px`,
				marginTop: `${offsetTop.value}px`,
			});
		});
	});

	return [
		computed(() => {
			return unref(list)
				.slice(start.value, end.value)
				.map((item, index) => ({
					data: item,
					index: index + start.value,
				}));
		}),

		(index: number) => {
			if (containerEl.value) {
				containerEl.value.scrollTop = getDistanceTop(index);
				calculateRange();
			}
		},
	];
};

export default useVirtualList;
