import { getCurrentInstance, onUnmounted } from 'vue';

export default (hook: () => any, target = getCurrentInstance()) =>
	target?.isUnmounted ? hook() : onUnmounted(hook, target);
