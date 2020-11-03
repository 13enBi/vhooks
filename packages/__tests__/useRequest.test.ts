import { useRequest } from "..";
import { nextTick, ref } from "vue";
import { isPromise } from "../utils";

describe("useRequest", () => {
	beforeAll(() => {
		jest.useFakeTimers();
	});

	const runAllTimers = async () => (jest.runAllTimers(), await nextTick());
	const timeOut = async (time = 500) => (await jest.advanceTimersByTime(time), await nextTick());

	const mockRequestMethod = (type: "success" | "fail" = "success") =>
		new Promise((resolve, reject) => {
			setTimeout(() => {
				type === "success" ? resolve("success") : reject("fail");
			}, 500);
		});

	const mockRequest = useRequest.create<"success" | "fail" | void>({
		requestMethod: mockRequestMethod,
	});

	test("should be defined", () => {
		expect(useRequest).toBeDefined();
	});

	test("useRequest should be Promise", () => {
		expect(isPromise(mockRequest())).toBeTruthy();
	});

	describe("useRequest status should work", () => {
		test("loading and data should work", async () => {
			const { loading, data } = mockRequest();

			expect(loading.value).toBe(true);
			expect(data.value).toBeUndefined();

			await runAllTimers();

			expect(loading.value).toBe(false);
			expect(data.value).toBe("success");
		});

		test("error should work", async () => {
			const res = mockRequest("fail");

			const { error } = res;

			expect(error.value).toBeUndefined();

			res.catch((err) => expect(err).toBe("fail"));

			await runAllTimers();

			expect(error.value).toBe("fail");
		});
	});

	test("initialData should work", async () => {
		const { data } = mockRequest("success", { initialData: "mock" });

		expect(data.value).toBe("mock");

		await runAllTimers();

		expect(data.value).toBe("success");
	});

	test("onCallback should work", async () => {
		const onSuccess = jest.fn(),
			onError = jest.fn();

		mockRequest("success", { onSuccess, onError });

		await runAllTimers();

		expect(onSuccess.mock.calls.length).toBe(1);
		expect(onSuccess.mock.calls[0][0]).toBe("success");
		expect(onError.mock.calls.length).toBe(0);

		mockRequest("fail", { onSuccess, onError });

		await runAllTimers();

		expect(onSuccess.mock.calls.length).toBe(1);
		expect(onError.mock.calls.length).toBe(1);
		expect(onError.mock.calls[0][0]).toBe("fail");
	});

	test("cancel should work", async () => {
		const { cancel, data, loading, run } = mockRequest("success", { immediate: false });

		expect(loading.value).toBe(false);
		expect(data.value).toBeUndefined();

		run();

		expect(loading.value).toBe(true);
		expect(data.value).toBeUndefined();

		cancel();

		expect(loading.value).toBe(false);
		expect(data.value).toBeUndefined();

		await runAllTimers();

		expect(loading.value).toBe(false);
		expect(data.value).toBeUndefined();
	});

	test("immediate should work", async () => {
		const { run, data, loading } = mockRequest("success", { immediate: false });

		expect(loading.value).toBe(false);
		expect(data.value).toBeUndefined();

		run();
		expect(loading.value).toBe(true);

		await runAllTimers();

		expect(loading.value).toBe(false);
		expect(data.value).toBe("success");
	});

	describe("run should work", () => {
		test("run should be Promise", async () => {
			const { run } = mockRequest();

			const successCb = jest.fn(),
				failCb = jest.fn();

			expect(isPromise(run())).toBeTruthy();

			run().then(successCb).catch(failCb);
			await runAllTimers();
			await timeOut(1000);

			expect(successCb).toHaveBeenCalledTimes(1);
			expect(successCb.mock.calls[0][0]).toBe("success");
			expect(failCb).toHaveBeenCalledTimes(0);

			run("fail").then(successCb).catch(failCb);
			await runAllTimers();
			await timeOut(1000);

			expect(successCb).toHaveBeenCalledTimes(1);
			expect(failCb).toHaveBeenCalledTimes(1);
			expect(failCb.mock.calls[0][0]).toBe("fail");
		});

		test("run with new params should work", async () => {
			const { run, loading, data, error } = mockRequest("success");

			await runAllTimers();

			expect(loading.value).toBe(false);
			expect(data.value).toBe("success");

			run("fail");

			expect(loading.value).toBe(true);

			await runAllTimers();

			expect(loading.value).toBe(false);
			expect(error.value).toBe("fail");
		});
	});

	describe("polling should work", () => {
		test("polling and cancel should work", async () => {
			const cb = jest.fn(),
				onSuccess = jest.fn();
			const polling = 1000;

			const { loading, data, cancel } = mockRequest("success", {
				polling,
				onSuccess,
				requestMethod: (type: any) => {
					cb();
					return mockRequestMethod(type);
				},
			});

			expect(loading.value).toBe(true);

			await timeOut();

			expect(loading.value).toBe(false);
			expect(data.value).toBe("success");
			expect(cb).toHaveBeenCalled();
			expect(onSuccess).toHaveBeenCalled();

			await timeOut(polling);
			expect(cb).toHaveBeenCalledTimes(2);
			expect(onSuccess).toHaveBeenCalledTimes(2);

			await timeOut(polling);
			expect(cb).toHaveBeenCalledTimes(3);
			expect(onSuccess).toHaveBeenCalledTimes(3);

			cancel();
			await timeOut(polling);
			expect(cb).toHaveBeenCalledTimes(3);
			expect(onSuccess).toHaveBeenCalledTimes(3);
		});
	});

	describe("debounce should work", () => {
		const cb = jest.fn(),
			onSuccess = jest.fn(),
			requestMethod = (type: any) => {
				cb();
				return mockRequestMethod(type);
			},
			debounce = 100;

		test("debounce and cancel should work", async () => {
			const { cancel, run } = mockRequest("success", {
				onSuccess,
				debounce,
				requestMethod,
			});

			for (const i of Array(5).keys()) {
				run();
				await timeOut(10);
			}

			await runAllTimers();

			expect(cb).toHaveBeenCalledTimes(1);
			expect(onSuccess).toHaveBeenCalledTimes(1);

			for (const i of Array(5).keys()) {
				run();
				await timeOut(10);
			}

			cancel();
			await runAllTimers();

			expect(cb).toHaveBeenCalledTimes(1);
			expect(onSuccess).toHaveBeenCalledTimes(1);
		});

		test("leading should work", async () => {
			cb.mockReset();

			const debounce = 100;

			const { run } = mockRequest("success", {
				debounce,
				leading: true,
				requestMethod,
			});

			for (const i of Array(5).keys()) {
				run();
				await timeOut(10);
			}
			await timeOut();
			expect(cb).toHaveBeenCalledTimes(1);

			await runAllTimers();
			await timeOut(200);
			expect(cb).toHaveBeenCalledTimes(2);
		});

		test("run onCallback should work", async () => {
			//onSuccess.mockReset();

			const debounce = 100;

			const { run } = mockRequest("success", {
				debounce,
			});

			let count = 0;

			for (const _ of Array(5).keys()) {
				run()
					.then(onSuccess)
					.then(() => count++);
				await timeOut(10);
			}

			await runAllTimers();
			await timeOut(1000);

			//expect(onSuccess).toHaveBeenCalledTimes(1);
			expect(count).toBe(1);
		});
	});

	test("cache should work", async () => {
		const cb = jest.fn(),
			requestMethod = (type: any) => {
				cb();
				return mockRequestMethod(type);
			},
			cacheKey = "success",
			cacheTime = 5000;

		const { run, clearCache } = mockRequest("success", {
			requestMethod,
			cacheKey,
			cacheTime,
		});

		await timeOut();
		expect(cb).toHaveBeenCalledTimes(1);

		run();

		await timeOut();
		expect(cb).toHaveBeenCalledTimes(1);

		await timeOut(5000);

		run();
		await timeOut();
		expect(cb).toHaveBeenCalledTimes(2);

		clearCache(cacheKey);
		run();
		await timeOut();
		expect(cb).toHaveBeenCalledTimes(3);
	});

	test("ready should work", async () => {
		const cb = jest.fn(),
			requestMethod = (type: any) => {
				cb();
				return mockRequestMethod(type);
			};

		const mockReady = ref(false);

		const { run } = mockRequest("success", { requestMethod, ready: [mockReady] });

		run();
		await runAllTimers();
		expect(cb).toHaveBeenCalledTimes(0);

		run();
		await runAllTimers();
		expect(cb).toHaveBeenCalledTimes(0);

		mockReady.value = true;

		await runAllTimers();
		expect(cb).toHaveBeenCalledTimes(1);
	});

	test("deps should work", async () => {
		const cb = jest.fn(),
			requestMethod = (type: any) => {
				cb();
				return mockRequestMethod(type);
			};

		const mockDep = ref(0);

		mockRequest("success", { requestMethod, deps: mockDep, immediate: false });

		mockDep.value++;

		await runAllTimers();
		expect(cb).toHaveBeenCalledTimes(1);

		mockDep.value++;

		await runAllTimers();
		expect(cb).toHaveBeenCalledTimes(2);
	});

	test("mutation should work", async () => {
		const { data, mutation } = mockRequest();

		await runAllTimers();

		expect(data.value).toBe("success");

		mutation("test");
		expect(data.value).toBe("test");

		mutation((old) => "mock" + old);
		expect(data.value).toBe("mocktest");
	});

	test("delay should work", async () => {
		const delay = 1000;
		const { loading } = mockRequest("success", { delay });

		await timeOut();
		expect(loading.value).toBeTruthy();

		await timeOut(delay);
		expect(loading.value).toBeFalsy();
	});

	test("formatData should work", async () => {
		const { data } = mockRequest("success", {
			formatData(data) {
				return data + "_mock";
			},
		});

		await runAllTimers();
		expect(data.value).toBe("success_mock");
	});
});
