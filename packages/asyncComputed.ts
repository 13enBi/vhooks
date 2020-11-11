import { Ref, watchEffect } from 'vue';
import { useAsync } from '.';

const asyncComputed = <T>(getter: () => any, defaultVal: T): Ref<T> => {
	const { data, run } = useAsync(getter, { immediate: false, initialData: defaultVal });

	watchEffect(run);

	return data;
};

export default asyncComputed;
