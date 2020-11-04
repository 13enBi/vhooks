import { TimeOut } from './utils';

export type CacheKey = string | symbol;

const useCache = () => {
	const cacheMap = new Map<CacheKey, { data?: any; timer?: TimeOut }>();

	const getCache = (key: CacheKey) => {
			return cacheMap.get(key)?.data;
		},
		setCache = <T>(key: CacheKey, data: T, cacheTime: number | 'infinity' = 3e5): T => {
			cacheMap.get(key)?.timer && clearTimeout(cacheMap.get(key)?.timer as TimeOut);

			const timer =
				cacheTime !== 'infinity' && cacheTime
					? setTimeout(() => {
							cacheMap.delete(key);
					  }, cacheTime)
					: void 0;

			cacheMap.set(key, {
				data,
				timer,
			});

			return data;
		},
		clearCache = (key: CacheKey) => {
			key === '*' ? cacheMap.clear() : cacheMap.delete(key);
		};

	return { getCache, setCache, clearCache };
};

export default useCache;
