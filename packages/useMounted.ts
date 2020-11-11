import { getCurrentInstance, onMounted } from 'vue';

export default (hook: () => any, target = getCurrentInstance()) =>
	target?.isMounted ? hook() : onMounted(hook, target);
