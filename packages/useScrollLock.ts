import { onMounted, ref, onUnmounted, watch } from "vue";
import { getTargetElement } from "./utils";

import { Target } from "./utils";
import { Ref } from "vue";

const isIos = /iP(ad|hone|od)/.test(window?.navigator?.platform);

const elMap = new WeakMap<Target & Element, Ref<boolean>>();

const useScrollLock = (target?: Target, sync = true) => {
    const isLock = ref(false);

    onMounted(() => {
        const el = getTargetElement(target, document.body) as Ref<HTMLElement>;

        if (!el.value) return;

        const initOverflow = getComputedStyle(el.value).getPropertyValue("overflow"),
            elItem = elMap.get(el.value),
            has = elItem ? elItem : ((elMap.set(el.value, ref(false)), elMap.get(el.value)) as Ref<boolean>);

        const handleIosScrollLock = (e: TouchEvent) => {
                if (!(el.value as Node).contains(e.target as Node)) return true;

                if (e.touches.length > 1) return true;

                if (e.preventDefault) e.preventDefault();

                return false;
            },
            iosLock = () => {
                document.addEventListener("touchmove", handleIosScrollLock, { passive: false });
            },
            iosUnlock = () => {
                document.removeEventListener("touchmove", handleIosScrollLock);
            };

        const handleLock = () => {
                isIos ? iosLock() : (el.value.style.overflow = "hidden");

                sync && (has.value = true);
            },
            handleUnLock = () => {
                isIos ? iosUnlock() : (el.value.style.overflow = initOverflow);

                sync && (has.value = false);
            };

        if (sync) {
            watch(
                has,
                (is) => {
                    isLock.value = is;
                },
                { immediate: true, flush: "sync" }
            );
        }

        watch(isLock, (is) => {
            if (!sync || is !== has.value) {
                is ? handleLock() : handleUnLock();
            }
        });

        onUnmounted(() => {
            handleUnLock();
        });
    });

    return isLock;
};

export default useScrollLock;
