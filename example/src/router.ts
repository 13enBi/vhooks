import { createRouter, createWebHashHistory } from "vue-router";

import home from "./view/index.vue";
import useEventListener from "./view/useEventListener";
import useEventHub from "./view/useEventHub";
import useStore from "./view/useStore";
import debounceWatch from "./view/debounceWatch";
import throttleWatch from "./view/throttleWatch";
import useBoolean from "./view/useBoolean";
import useHover from "./view/useHover";
import useInterval from "./view/useInterval";
import useInViewport from "./view/useInViewport";
import useVirtualList from "./view/useVirtualList";
import useRequest from "./view/useRequest/index";
import useLazyLoad from "./view/useLazyLoad";

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{ path: "/", component: home },
		{
			path: "/useEventListener",
			component: useEventListener,
		},
		{
			path: "/useEventHub",
			component: useEventHub,
		},
		{
			path: "/useStore",
			component: useStore,
		},
		{
			path: "/debounceWatch",
			component: debounceWatch,
		},
		{
			path: "/throttleWatch",
			component: throttleWatch,
		},
		{
			path: "/useBoolean",
			component: useBoolean,
		},
		{
			path: "/useHover",
			component: useHover,
		},
		{ path: "/useInterval", component: useInterval },
		{ path: "/useInViewport", component: useInViewport },
		{ path: "/useVirtualList", component: useVirtualList },
		{ path: "/useRequest", component: useRequest },
		{ path: "/useLazyLoad", component: useLazyLoad },
	],
});

export default router;
