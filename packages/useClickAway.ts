import { onMounted, computed } from 'vue';
import { getTargetElement, isArray } from './utils';
import useEventListener from './useEventListener';

import { Target } from './utils';
import { Ref } from 'vue';

const useClickAway = (target: Target | Target[], handler: (event?: MouseEvent) => any) => {
	onMounted(() => {
		const els = computed(() => {
			return (isArray(target) ? target.map((i) => getTargetElement(i)) : [getTargetElement(target)]).filter(
				(el) => el?.value
			);
		});

		const handleClickAway = (event: MouseEvent) => {
			const nodeList = els.value as Ref<Node>[],
				target = event.target as Node;

			if (nodeList.every((node) => !node.value.contains(target))) {
				handler(event);
			}
		};

		useEventListener('click', handleClickAway, { target: document });
	});
};

export default useClickAway;
