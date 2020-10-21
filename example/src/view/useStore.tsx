import { defineComponent } from "vue";
import { useStore, useState, useGetters, useMutations } from "../hooks";

const style = { marginTop: "20px" };

const div = (str) => <div style={style}>{str}</div>;

const Store = defineComponent(() => {
	const store = useStore();

	return () => div(`store :${JSON.stringify(store)}`);
});

const State = defineComponent(() => {
	const { count } = useState(["count"]);

	return () => div(`state.count:${count.value} `);
});

const Getters = defineComponent(() => {
	const { getCount } = useGetters(["getCount"]);

	return () => div(`getters.getCount :${getCount.value}`);
});

const Mutations = defineComponent(() => {
	const { add } = useMutations({ add: "addCount" });

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
