//@ts-nocheck
import { ref, nextTick } from 'vue';
import { debounceWatch } from '..';

describe('debounceWatch', () => {
	beforeAll(() => {
		jest.useFakeTimers();
	});

	const runAllTimers = async () => (jest.runOnlyPendingTimers(), await nextTick());
	const timeOut = async (time = 100) => (jest.advanceTimersByTime(time), await nextTick());
	test('debounceWatch should defined', () => {
		expect(debounceWatch).toBeDefined();
	});

	test('debounceWatch should work', async () => {
		const cb = jest.fn();

		const count = ref(0);

		debounceWatch(count, cb, { wait: 500 });

		count.value++;
		await timeOut();
		count.value++;
		await timeOut();
		count.value++;

		await runAllTimers();
		await timeOut(600);

		expect(cb).toHaveBeenCalledTimes(1);
	});
});
