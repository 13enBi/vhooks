import { Ref } from 'vue';
import useCache, { CacheKey } from '../useCache';
import { AsyncConfig, AsyncResult } from '../useAsync';
import { CreateInstance } from './createInstance';
import { WrapRef } from '../utils';

export type RequestConfig<Params = any, CustomeConfig = {}, CustomeResult = {}> = AsyncConfig & {
	immediate?: boolean;
	polling?: number;
	debounce?: number;
	throttle?: number;
	leading?: boolean;
	ready?: Ref<any>[];
	cacheStore?: ReturnType<typeof useCache>;
	cacheKey?: CacheKey;
	cacheTime?: number | 'infinity';
	requestMethod?(params: Params): Promise<any>;
	formatResult?(
		result: RequestResult<Params, CustomeResult>,
		config?: Readonly<Omit<RequestConfig<Params, CustomeConfig>, 'formatResult'>>
	): any;
} & CustomeConfig;

export type RequestResult<Params = any, CustomeResult = {}> = Omit<AsyncResult, 'isError' | 'run'> & {
	run: (newParams?: WrapRef<Params>) => Promise<any | undefined | null>;
	clearCache: ReturnType<typeof useCache>['clearCache'];
} & CustomeResult;

export type DefaultConfig = RequestConfig &
	Required<
		Pick<
			RequestConfig,
			| 'requestMethod'
			| 'formatData'
			| 'formatResult'
			| 'leading'
			| 'delay'
			| 'cacheTime'
			| 'cacheStore'
			| 'onSuccess'
			| 'onError'
		>
	>;

export type Instance = ReturnType<CreateInstance>;

export { AsyncConfig, AsyncResult };

export { AxiosRequestConfig, AxiosStatic } from 'axios';
