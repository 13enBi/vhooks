import { Ref, isRef, ref, watchEffect } from "vue";
import { isFunction, hasKey, WrapRef } from ".";

export type BasicTarget<T = HTMLElement | Element> = (() => T) | WrapRef<T | null | undefined>;
export type TargetElement = HTMLElement | Element | Document | Window | null;
export type Target = BasicTarget<TargetElement>;

export function getTargetElement(
	target: BasicTarget<TargetElement>,
	defaultElement?: TargetElement
): Ref<TargetElement> {
	const targetElement = ref();

	if (isFunction(target)) {
		targetElement.value = target();
	} else if (isRef(target)) {
		watchEffect(
			() => {
				targetElement.value = target.value;
			},
			{ flush: "sync" }
		);
	} else {
		targetElement.value = target || defaultElement;
	}

	return targetElement;
}

export const getAttr = (el: Element, attr: string) => el.getAttribute(attr);
export const setAttr = (el: Element, attr: string, value: string) => el.setAttribute(attr, value);

export const getPreCountChild = (el: Element, preCount = 0) => {
	const child = el.children;
	return child[Math.max(0, child.length - preCount - 1)];
};

export const getRootScrollTop = () =>
	window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

export const getSrcollTop = (el: Element | Window): number =>
	hasKey(el, "scrollTop") ? (el as Element).scrollTop : (el as Window).pageYOffset;

export const getElPageTop = (el: Element | Window) =>
	el === window ? 0 : (el as HTMLElement).getBoundingClientRect().top + getRootScrollTop();
