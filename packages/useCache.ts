import { TimeOut } from "./utils";

export type CacheKey = string | symbol;

const useCache = () => {
    const cacheMap = new Map<CacheKey, { data?: any; timer?: TimeOut }>();

    const getCache = (key: CacheKey) => {
            return cacheMap.get(key)?.data;
        },
        setCache = (key: CacheKey, data: any, cacheTime: number = 3e5) => {
            cacheMap.get(key)?.timer && clearTimeout(cacheMap.get(key)?.timer as TimeOut);

            const timer = cacheTime
                ? setTimeout(() => {
                      cacheMap.delete(key);
                  }, cacheTime)
                : void 0;

            return cacheMap.set(key, {
                data,
                timer,
            });
        },
        clearCache = (key: CacheKey) => {
            key === "*" ? cacheMap.clear() : cacheMap.delete(key);
        };

    return { getCache, setCache, clearCache };
};

export default useCache;
