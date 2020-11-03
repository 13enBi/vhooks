import { defineComponent, ref } from 'vue';

import { useInterval } from '../hooks';

export default defineComponent(() => {
	const count = ref(0),
		interval = ref(1000);

	const [run, stop] = useInterval(() => count.value++, interval, { immediate: true });

	return () => (
		<>
			<div>count:{count.value}</div>
			<div>interval :{interval.value / 1000}s</div>
			<button onClick={run}>run</button>
			<button onClick={stop}>stop</button>
			<button
				onClick={() => {
					interval.value += 1000;
				}}
			>
				add 1s interval
			</button>
		</>
	);
});
