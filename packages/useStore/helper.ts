import { toRef, Ref, DeepReadonly, UnwrapRef } from 'vue';
import { StoreResult, useStore, MutationsTree, GetterTree } from '.';
import { isArray, UnwrapNestedRefs } from '../utils';
import { State } from '@13enbi/vhooks/types';

type WrapRef<T> = T extends Ref ? T : Ref<UnwrapRef<T>>;
type MapperRef<T> = Readonly<WrapRef<T>>;

type a = Ref<Ref<string>>;

interface Mapper<R extends Record<any, any>> {
	<Key extends keyof R>(map: Key[]): { [K in Key]: MapperRef<R[K]> };
	<Map extends Record<string, string>>(map: Map): { [K in keyof Map]: MapperRef<any> };
}

type HelperMap = string[] | Record<string, string>;

const normalizeMap = (map: HelperMap) =>
	isArray(map)
		? map.map((key) => ({ key, val: key }))
		: Object.entries(map).map(([key, value]) => ({ key, val: value }));

const useMap = (type: keyof StoreResult, needRef = true) => (map: HelperMap) => {
	const use = useStore()[type];

	return normalizeMap(map).reduce(
		(mapped, { key, val }) => ((mapped[key] = needRef ? toRef(use, val) : use[val]), mapped),
		{} as Record<string, any>
	);
};

export const useState: Mapper<State> = useMap('state');

export const useGetters: Mapper<GetterTree<State>> = useMap('getters');

export const useMutations: Mapper<MutationsTree<State>> = useMap('commit', false);
