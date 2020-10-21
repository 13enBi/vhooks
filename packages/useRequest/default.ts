import axios from "axios";
import useCache from "../useCache";
import { NOOP } from "../utils";

import { DefaultConfig, AxiosRequestConfig } from "./types";

axios.interceptors.response.use((res) => res.data);

const defaultConfig: DefaultConfig = {
    immediate: true,
    delay: 0,
    cacheTime: 5 * 60 * 60,
    leading: false,
    requestMethod: (params: string | AxiosRequestConfig) => axios(params as AxiosRequestConfig),
    formatResult: (result) => result,
    formatData: (data) => data,
    cacheStore: useCache(),
    onSuccess: NOOP,
    onError: NOOP,
};

export default defaultConfig;
