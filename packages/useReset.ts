import { ref } from "vue";

import { Ref } from "vue";

const useReset = <T>(initVal: T): [Ref<T>, () => void] => {
    const val = ref(initVal) as Ref<T>;

    return [val, () => (val.value = initVal)];
};

export default useReset;
