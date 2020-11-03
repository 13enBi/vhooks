import { createStore } from './hooks';

export default createStore({
	state: { count: 0 },
	getters: {
		getCount(state) {
			return `count: ${state.count}`;
		},
	},
	mutations: {
		addCount(state) {
			state.count++;
		},
	},
});
