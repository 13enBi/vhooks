import "intersection-observer";
import { getTargetElement, isArray } from "./utils";
import { onUnmounted } from "vue";

import { Target } from "./utils";
import { Ref } from "vue";

const useIntersectionObserver = (
    target: Target | Target[],
    cb: IntersectionObserverCallback,
    options: Omit<IntersectionObserverInit, "root"> & { root?: Target } = {}
) => {
    const root = options.root;

    const els = isArray(target) ? target.map((el) => getTargetElement(el)) : [getTargetElement(target)],
        rootEl = getTargetElement(root, document) as Ref<Element>;

    const ob = new IntersectionObserver(cb, { ...options, root: rootEl.value });

    (els as Ref<Element>[]).forEach((item) => item.value && ob.observe(item.value));

    onUnmounted(() => {
        ob?.disconnect();
    });

    return ob;
};

export default useIntersectionObserver;
