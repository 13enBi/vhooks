import axios from 'axios';
import { readonly } from 'vue';
import { isFunction, extend, WrapRef } from '../utils';
import useCache from '../useCache';
import defaultConfig from './default';
import dispatchRequest from './dispatchRequest';

import { AxiosRequestConfig, RequestConfig, AxiosStatic, RequestResult, DefaultConfig } from './types';

const createInstance = <Params = string | AxiosRequestConfig, CustomeResult = {}, CustomeConfig extends object = {}>(
	baseConfig:
		| RequestConfig<Params, CustomeConfig, CustomeResult>
		| ((axios?: AxiosStatic) => RequestConfig<Params, CustomeConfig, CustomeResult> | void)
) => {
	if (isFunction(baseConfig)) {
		baseConfig = baseConfig(axios) || ({} as RequestConfig<Params, CustomeConfig, CustomeResult>);
	}

	if (baseConfig.cacheStore === void 0) {
		baseConfig.cacheStore = useCache();
	}

	baseConfig = { ...defaultConfig, ...baseConfig } as DefaultConfig & CustomeConfig;

	const instance = (
		params: WrapRef<Params>,
		config: Partial<RequestConfig<Params, CustomeConfig, CustomeResult>> = {}
	) => {
		const __config = { ...baseConfig, ...config } as DefaultConfig;

		const result = dispatchRequest<Params>(params, __config);

		const { run } = result,
			{ immediate, formatResult } = __config;

		return extend(
			immediate ? run() : Promise.resolve(null),
			formatResult(result, readonly(__config as any))
		) as RequestResult<Params, CustomeResult> & Promise<any>;
	};

	instance.default = baseConfig;

	return instance;
};

export type CreateInstance = typeof createInstance;

export default createInstance;
