import { timeOut } from '../../packages/utils';
import { createStore } from './hooks';

export default createStore({
	state: { count: 0, name: 'wuhu' },
	getters: {
		getCount(state) {
			return state.count;
		},
		getName(state) {
			return state.name;
		},

		get(_, getters) {
			return `count:${getters.getCount}! name:${getters.getName}`;
		},
	},
	mutations: {
		async addCount({ state, dispatch, getters }) {
			await dispatch('setCount', getters.getCount + 1);
		},

		async setCount({ state }, count) {
			await timeOut(1000);

			state.count = count;
		},
	},
});
