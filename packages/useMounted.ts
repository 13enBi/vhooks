import { getCurrentInstance, onMounted, ComponentInternalInstance } from 'vue';

const useMounted = (hook: () => any, target: ComponentInternalInstance | null = getCurrentInstance()) => {
	const isMounted = target?.isMounted;

	return isMounted ? hook() : onMounted(hook, target);
};

export default useMounted;
