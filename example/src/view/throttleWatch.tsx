import { defineComponent, ref } from 'vue';

import { throttleWatch } from '../hooks';

export default defineComponent(() => {
	const count = ref(0),
		count2 = ref(0);

	throttleWatch(
		count,
		(newCount) => {
			count2.value = newCount;
		},
		{ wait: 500 }
	);

	return () => (
		<>
			<div>count:{count.value}</div>
			<div style={{ marginTop: '10px' }}>throttle count:{count2.value}</div>
			<button onClick={() => count.value++}>add count</button>
		</>
	);
});
