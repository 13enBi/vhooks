import { defineComponent } from 'vue';
import { useStore, useState, useGetters, useMutations } from '../hooks';

const style = { marginTop: '20px' };

const div = (str) => <div style={style}>{str}</div>;

const Store = defineComponent(() => {
	const store = useStore();

	return () => div(`store :${JSON.stringify(store)}`);
});

const State = defineComponent(() => {
	const { count, wuhu } = useState(['count', 'wuhu']);

	return () => div(`state.count:${count.value} `);
});

const Getters = defineComponent(() => {
	const { get } = useGetters(['get']);

	return () => div(`get:${get.value}`);
});

const Mutations = defineComponent(() => {
	const { add } = useMutations({ add: 'addCount' });

	return () => (
		<button onClick={add} style={style}>
			addCount
		</button>
	);
});

export default defineComponent(() => {
	return () => (
		<>
			<Store></Store>
			<State></State>
			<Getters></Getters>
			<Mutations></Mutations>
		</>
	);
});
