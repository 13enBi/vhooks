import { watch, computed, unref, isRef } from "vue";
import { isObject, extend, NOOP, pipe } from "../utils";
import useAsync from "../useAsync";
import useDebounceFn from "../useDebounceFn";
import useThrottleFn from "../useThrottleFn";
import useInterval from "../useInterval";

import { DefaultConfig, RequestResult } from "./types";
import { Func, WrapRef } from "../utils";

const wrapRun = (
	{ originRun, originCancel }: { originRun: () => Promise<any>; originCancel: () => void },
	config: Pick<DefaultConfig, "debounce" | "delay" | "throttle" | "polling" | "leading">
) => {
	const { polling, debounce, throttle, delay, leading } = config;

	const [pollingRun, pollingCancel] = polling ? useInterval(originRun, polling + delay) : [originRun, NOOP];

	const [debounceRun, debounceCancel] = debounce ? useDebounceFn(pollingRun, debounce, { leading }) : [, NOOP];

	const [throttleRun, throttleCancel] = throttle ? useThrottleFn(pollingRun, throttle, { leading }) : [, NOOP];

	return {
		run: debounceRun || throttleRun || pollingRun,
		cancel: pipe(debounceCancel, throttleCancel, pollingCancel, originCancel),
	};
};

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
	}: DefaultConfig
): RequestResult<Params> => {
	const runtimeCb: { onSuccess: Func; onError: Func } = {
		onSuccess: NOOP,
		onError: NOOP,
	};

	const getCacheData = () => cacheKey && getCache(cacheKey),
		setCacheData = (data: any) => {
			cacheKey && setCache(cacheKey, data, cacheTime);
		};

	const request = () => getCacheData() || requestMethod(unref(params));

	const { data, loading, error, run: originRun, cancel: originCancel, mutation } = useAsync(request, {
		immediate: false,
		initialData,
		onSuccess: pipe(setCacheData, (data: any) => runtimeCb.onSuccess(data), onSuccess),
		onError: pipe((err: any) => runtimeCb.onError(err), onError),
		delay,
		formatData,
	});

	const { run, cancel } = wrapRun({ originRun, originCancel }, { debounce, throttle, polling, leading, delay });

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
			runtimeCb.onSuccess = resolve;

			runtimeCb.onError = reject;
		});
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
