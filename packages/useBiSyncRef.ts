import { Ref } from 'vue';
import useSyncRef from './useSyncRef';

const useBiSyncRef = (target1: Ref<any>, target2: Ref<any>) => {
	const stop1 = useSyncRef(target1, target2),
		stop2 = useSyncRef(target2, target1);

	return () => (stop1(), stop2());
};

export default useBiSyncRef;
