import { defineComponent, ref } from 'vue';

import { debounceWatch } from '../hooks';

export default defineComponent(() => {
	const count = ref(0),
		count2 = ref(0);

	debounceWatch(
		count,
		(newCount) => {
			count2.value = newCount;
		},
		{ wait: 500 }
	);

	return () => (
		<>
			<div>count:{count.value}</div>
			<div style={{ marginTop: '10px' }}>debounce count:{count2.value}</div>
			<button onClick={() => count.value++}>add count1</button>
		</>
	);
});
