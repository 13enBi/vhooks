import { customRef } from 'vue';
import { isFunction } from './utils';

import { Ref } from 'vue';
import { Getter } from './utils';

const getLocal = <T>(key: string, defaultVal: Getter<T>) => {
	const localVal = localStorage.getItem(key);
	return localVal ? JSON.parse(localVal) : isFunction(defaultVal) ? defaultVal() : defaultVal;
};

const useLocalStorageRef = <T>(localKey: string, initVal: Getter<T>): Ref<T> => {
	let val = getLocal(localKey, initVal);

	return customRef((track, trigger) => {
		return {
			get: () => (track(), val),
			set(newVal: T) {
				val = newVal;
				trigger();
				localStorage.setItem(localKey, JSON.stringify(newVal));
			},
		};
	});
};

export default useLocalStorageRef;
