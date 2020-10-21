import { ref } from "vue";
import { isBoolean } from "./utils";

import { Ref } from "vue";

const useBoolean = (initBool = false): [Ref<boolean>, (newBool?: any) => void] => {
	const bool = ref(initBool);

	const toggle = (newBool: any) => (isBoolean(newBool) ? (bool.value = newBool) : (bool.value = !bool.value));

	return [bool, toggle];
};

export default useBoolean;
