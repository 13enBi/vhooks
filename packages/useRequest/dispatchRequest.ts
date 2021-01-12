import { watch, computed, unref, isRef } from 'vue';
import { isObject, extend, NOOP, pipe, timeOut } from '../utils';
import useAsync from '../useAsync';
import useDebounceFn from '../useDebounceFn';
import useThrottleFn from '../useThrottleFn';
import useInterval from '../useInterval';

import { DefaultConfig, RequestResult } from './types';
import { Func, WrapRef } from '../utils';

const dispatchRequest = <Params>(
	params: WrapRef<Params>,
	{
		initialData,
		onSuccess,
		onError,
		deps,
		delay,
		ready = [],
		cacheKey,
		cacheTime,
		requestMethod,
		formatData,
		cacheStore: { getCache, setCache, clearCache },
		debounce,
		throttle,
		polling,
		leading,
	}: Omit<DefaultConfig, 'immediate' | 'formatResult'>
): RequestResult<Params> => {
	let queueSuccess: Func = NOOP,
		queueError: Func = NOOP;

	const queueReset = () => (queueSuccess = queueError = NOOP);

	const wrapRun = () => {
		const [pollingRun, pollingCancel] = polling ? useInterval(originRun, polling + delay) : [originRun, NOOP];

		const [debounceRun, debounceCancel] = debounce ? useDebounceFn(pollingRun, debounce, { leading }) : [, NOOP];

		const [throttleRun, throttleCancel] = throttle ? useThrottleFn(pollingRun, throttle, { leading }) : [, NOOP];

		return [
			debounceRun || throttleRun || pollingRun,
			pipe(debounceCancel, throttleCancel, pollingCancel, originCancel),
		];
	};

	const getCacheData = () => cacheKey && getCache(cacheKey),
		setCacheData = (data: any) => {
			cacheKey && setCache(cacheKey, data, cacheTime);
			return data;
		};

	const request = () => getCacheData() || requestMethod(unref(params));

	const { data, loading, error, run: originRun, cancel: originCancel, mutation } = useAsync(request, {
		immediate: false,
		initialData,
		onSuccess: (data: any) => queueSuccess(data),
		onError: (err: any) => queueError(err),
	});

	const [run, cancel] = wrapRun();

	const dispatchRun = (newParams = params) => {
		if (!isReady.value) return Promise.resolve(null);

		if (newParams !== params) {
			if (isRef(newParams) && isRef(params)) {
				params.value = newParams.value;
			} else if (isObject(params) && isObject(newParams)) {
				params = extend(params, newParams);
			} else {
				params = newParams;
			}
		}

		run();

		return new Promise((resolve, reject) => {
			queueSuccess = resolve;
			queueError = reject;
		})
			.then(async (data: any) => (setCacheData(data), await timeOut(delay), formatData(data)))
			.then(onSuccess)
			.catch(onError)
			.finally(queueReset);
	};

	const isReady = computed(() => (ready.length === 0 ? true : ready.every((i) => unref(i))));

	const watchDeps = ([] as any[]).concat(isReady, deps).filter((dep) => dep);
	if (watchDeps.length) {
		watch(watchDeps, () => {
			dispatchRun();
		});
	}

	return {
		data,
		loading,
		error,
		mutation,
		run: dispatchRun,
		cancel,
		clearCache,
	};
};

export default dispatchRequest;
