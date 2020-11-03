import { defineComponent, ref } from 'vue';

import { useEventHub } from '../hooks';

const Demo = defineComponent(() => {
	const hub = useEventHub();

	const count = ref(0);

	hub.on('add', () => {
		count.value++;
	});

	return () => (
		<>
			<h3>ComponentA: on('add')</h3>
			<div>count:{count.value}</div>
		</>
	);
});

const Demo2 = defineComponent(() => {
	const hub = useEventHub();

	const add = () => hub.emit('add');

	return () => (
		<>
			<h3>ComponentB: emit('add')</h3>
			<button onClick={add}>add</button>
		</>
	);
});

export default defineComponent(() => {
	return () => (
		<>
			<Demo></Demo>
			<Demo2></Demo2>
		</>
	);
});
