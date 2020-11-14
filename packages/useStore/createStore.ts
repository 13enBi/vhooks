import { reactive, computed, readonly, App, inject } from 'vue';
import { extend } from '../utils';

export type CreateStoreOpts = { strict: boolean };
export type GetterTree<T> = Record<string, (state: T, getters: Readonly<Record<string, any>>) => any>;
export type MutationsTree<T> = Record<
	string,
	(
		context: {
			state: T;
			dispatch: (type: string, payload: unknown) => any;
			getters: Readonly<Record<string, any>>;
		},
		payload?: any
	) => void
>;

export type StoreGetter<T extends Record<string, any>> = {
	[key in keyof T]: ReturnType<T[key]>;
};

export type StoreCommit<T extends Record<string, any>> = {
	[key in keyof T]: (payload: Parameters<T[key]>[1]) => void;
};

export const storeSymbol = Symbol('store');

export const createStore = <S extends object>(
	{
		state: _state,
		getters: _getters = {},
		mutations: _mutations = {},
	}: {
		state: S;
		getters?: GetterTree<S>;
		mutations?: MutationsTree<S>;
	},
	{ strict }: CreateStoreOpts = { strict: false }
) => {
	const state = reactive(_state) as S;

	const getters = reactive(
		Object.entries(_getters).reduce(
			(getter, [key, value]) => ((getter[key] = computed(() => value(state, getters))), getter),
			{} as any
		)
	);

	const dispatch = (type: string, payload: unknown) => commit[type](payload);
	const commit = Object.entries(_mutations).reduce(
		(mutate, [key, value]) => (
			(mutate[key] = (payload: unknown) => value({ state, dispatch, getters }, payload)), mutate
		),
		{} as any
	);

	const store = {
		state: strict ? readonly(state) : state, 
		getters,
		commit,
	};

	return extend(store, { install: (app: App) => app.provide(storeSymbol, store) });
};

export type StoreResult<S = Record<string, any>> = {
	state: S;
	getters: StoreGetter<GetterTree<S>>;
	commit: StoreCommit<MutationsTree<S>>;
};

export const useStore = () => {
	const store = inject<StoreResult>(storeSymbol);

	if (!store) throw Error('useStore is called without provider');

	return store;
};
