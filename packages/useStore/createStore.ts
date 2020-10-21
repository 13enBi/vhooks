import { reactive, computed, readonly, App, inject } from "vue";

export type CreateStoreOpts = { isReadonly: boolean };
export type GetterTree<T> = Record<string, (state: T) => any>;
export type MutationsTree<T> = Record<string, (state: T, payload?: any) => void>;

export type StoreGetter<T extends Record<string, any>> = {
	[key in keyof T]: ReturnType<T[key]>;
};

export type StoreCommit<T extends Record<string, any>> = {
	[key in keyof T]: (payload: Parameters<T[key]>[1]) => void;
};

export const storeSymbol = Symbol("store");

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
	{ isReadonly }: CreateStoreOpts = { isReadonly: true }
) => {
	const state = reactive(_state) as S;

	const getters = Object.entries(_getters).reduce(
		(getter, [key, value]) => ((getter[key] = computed(() => value(state))), getter),
		{} as any
	);

	const commit = Object.entries(_mutations).reduce(
		(mutate, [key, value]) => ((mutate[key] = (payload: unknown) => value(state, payload)), mutate),
		{} as any
	);

	const store = {
		state: isReadonly ? readonly(state) : state,
		getters: reactive(getters),
		commit,
	};

	return {
		...store,
		install(app: App) {
			app.provide(storeSymbol, store);
		},
	};
};

export type StoreResult<S = Record<string, any>> = {
	state: S;
	getters: StoreGetter<GetterTree<S>>;
	commit: StoreCommit<MutationsTree<S>>;
};

export const useStore = () => {
	const store = inject<StoreResult>(storeSymbol);

	if (!store) throw Error("useStore is called without provider");

	return store;
};
