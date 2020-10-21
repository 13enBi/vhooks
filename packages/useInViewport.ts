import { getTargetElement } from "./utils";
import { ref, onMounted } from "vue";
import useIntersectionObserver from "./useIntersectionObserver";

import { Target } from "./utils";
import { Ref } from "vue";

const initIsView = (target: Target, root?: Target, initVisible = false) => {
    const el = getTargetElement(target) as Ref<Element>,
        rootEl = getTargetElement(root, document) as Ref<Element | Document>;

    if (!el.value || !rootEl.value) return initVisible;

    if (rootEl.value === document) {
        const viewPortWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const viewPortHeight =
            window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        const rect = el.value.getBoundingClientRect();

        if (rect) {
            const { top, bottom, left, right } = rect;
            return bottom > 0 && top <= viewPortHeight && left <= viewPortWidth && right > 0;
        }

        return initVisible;
    } else {
        const { clientHeight, clientWidth } = rootEl.value as Element,
            { scrollTop, scrollLeft } = el.value;

        return scrollTop < clientHeight && scrollLeft < clientWidth;
    }
};

const useInViewport = (
    target: Target,
    options: Omit<IntersectionObserverInit, "root"> & { root?: Target; initVisible?: boolean } = {}
) => {
    const root = options.root;
    const isInView = ref(initIsView(target, root, options.initVisible));

    onMounted(() =>
        useIntersectionObserver(target, (entries) => (isInView.value = entries[0].isIntersecting), options)
    );

    return isInView;
};

export default useInViewport;
