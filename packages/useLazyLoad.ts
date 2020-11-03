import { onMounted } from "vue";
import { getTargetElement, getAttr, setAttr } from "./utils";
import useIntersectionObserver from "./useIntersectionObserver";
import useMutationObserver from "./useMutationObserver";

import { Ref } from "vue";
import { Target } from "./utils";

export interface LazyLoadOpts {
	error?: string;
	loading?: string;
	dataset?: string;
	retry?: number;
	watch?: boolean;
}

const loadImage = (src: string) =>
	new Promise((resolve, reject) => {
		const img = new Image();

		img.src = src;

		img.onload = resolve;
		img.onerror = reject;
	});

const DEFAULT_URL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

const useLazyLoad = (target: Target, options: LazyLoadOpts = {}) => {
	const { loading = DEFAULT_URL, error = DEFAULT_URL, dataset = "data-src", retry = 1, watch = false } = options,
		tryCount = retry < 1 ? 1 : retry;

	const imgFilter = (img: HTMLElement) => !getAttr(img, "src") && getAttr(img, dataset);

	onMounted(() => {
		const el = getTargetElement(target) as Ref<HTMLElement>,
			imgList = Array.from(el.value.querySelectorAll("img")).filter(imgFilter);

		const handler = (entries: IntersectionObserverEntry[]) => {
			entries.forEach(async (entry) => {
				const { isIntersecting, target } = entry,
					src = getAttr(target, dataset);

				if (!isIntersecting || !src) return;

				ob.unobserve(target);

				setAttr(target, "src", loading);

				for (let i = 0; i < tryCount; i++) {
					try {
						await loadImage(src);
						setAttr(target, "src", src);

						break;
					} catch {
						if (i < retry) continue;
						else setAttr(target, "src", error);
					}
				}
			});
		};

		const ob = useIntersectionObserver(imgList, handler);

		if (watch) {
			useMutationObserver(el, (mutations) => {
				mutations.forEach((mutation) => {
					const { type, addedNodes } = mutation;
					if (type !== "childList") return;

					addedNodes.forEach((node) => {
						if (node.nodeName === "IMG" && imgFilter(node as HTMLElement)) {
							ob.observe(node as Element);
						}
					});
				});
			});
		}
	});
};

export default useLazyLoad;
