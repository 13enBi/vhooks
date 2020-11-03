import { useCache } from '..';
import { nextTick } from 'vue';

describe('useCache', () => {
	beforeAll(() => {
		jest.useFakeTimers();
	});
	const runAllTimers = async () => (jest.runAllTimers(), await nextTick());

	test('useCache should defined', () => {
		expect(useCache).toBeDefined();
	});

	test('useCache should work', async () => {
		const cacheKey = Symbol(),
			cacheKey2 = Symbol(),
			cacheData = 'mock',
			cacheData2 = 'mock2';

		const { getCache, setCache, clearCache } = useCache();

		const data1 = getCache(cacheKey);
		expect(data1).toBeUndefined();

		setCache(cacheKey, cacheData);
		setCache(cacheKey2, cacheData2);

		const data2 = getCache(cacheKey);
		expect(data2).toEqual(cacheData);

		clearCache(cacheKey);
		const data3 = getCache(cacheKey);
		expect(data3).toBeUndefined();

		clearCache('*');
		const data4 = getCache(cacheKey2);
		expect(data4).toBeUndefined();

		setCache(cacheKey, cacheData, 1000);
		await runAllTimers();

		const data5 = getCache(cacheKey);
		expect(data5).toBeUndefined();
	});
});
