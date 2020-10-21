import { reactive, toRefs } from "vue";
import useEventListener from "./useEventListener";
import { extend } from "./utils";

export interface CursorState {
	screenX: number;
	screenY: number;
	clientX: number;
	clientY: number;
	pageX: number;
	pageY: number;
}

const initState: CursorState = {
	screenX: NaN,
	screenY: NaN,
	clientX: NaN,
	clientY: NaN,
	pageX: NaN,
	pageY: NaN,
};

export default () => {
	const state = reactive(initState);

	useEventListener("mousemove", (event: MouseEvent) => {
		const { screenX, screenY, clientX, clientY, pageX, pageY } = event;
		extend(state, {
			screenX,
			screenY,
			clientX,
			clientY,
			pageX,
			pageY,
		});
	});

	return toRefs(state);
};
