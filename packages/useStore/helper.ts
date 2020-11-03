import { toRef, Ref, DeepReadonly } from 'vue';
import { StoreResult, useStore } from '.';
import { isArray } from '../utils';

interface Mapper<R extends Record<string, any>> {
	<Key extends string>(map: Key[]): { [K in Key]: R };
	<Map extends Record<string, string>>(map: Map): { [K in keyof Map]: R };
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

export const useState: Mapper<DeepReadonly<Ref<any>>> = useMap('state');

export const useGetters: Mapper<DeepReadonly<Ref<any>>> = useMap('getters');

export const useMutations: Mapper<(payload: any) => void> = useMap('commit', false);
