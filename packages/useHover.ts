import { ref, onMounted } from "vue";
import useEventListener from "./useEventListener";

import { Target } from "./utils";

export interface HoverOpts {
	enter?: (event?: Event) => any;
	leave?: (event?: Event) => any;
}

const useHover = (target: Target, options: HoverOpts = {}) => {
	const isHover = ref(false),
		{ enter, leave } = options;

	const handleEnter = (event: Event) => {
		isHover.value = true;
		enter?.(event);
	};

	const handleLeave = (event: Event) => {
		isHover.value = false;
		leave?.(event);
	};

	onMounted(() => {
		useEventListener(["mouseenter", "mouseleave"], [handleEnter, handleLeave], { target });
	});

	return isHover;
};

export default useHover;
