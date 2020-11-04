import { reactive, toRefs, watch } from 'vue';
import { timeOut, extend, isFunction } from './utils';

import { Deps, Getter } from './utils';
import { WatchOptions, Ref } from 'vue';

export interface AsyncStatus<T = any> {
	loading: boolean;
	error: any | void;
	data: T | void;
	isError: boolean;
}

export interface AsyncConfig {
	initialData?: Getter<any>;
	onSuccess?(data?: any): void;
	onError?(error?: any): void;
	delay?: number;
	deps?: Deps;
	formatData?(data: any): any;
}

export interface AsyncResult {
	data: Ref<any>;
	loading: Ref<boolean>;
	error?: Ref<Error | any>;
	isError: Ref<boolean>;
	run: () => Promise<any>;
	cancel: () => void;
	mutation: (mutate: Getter<any>) => void;
}

const initStatus: AsyncStatus = {
	loading: false,
	error: void 0,
	data: void 0,
	isError: false,
};

const userAsync = <T>(service: () => Promise<T>, options: WatchOptions & AsyncConfig = {}): AsyncResult => {
	const { onError, onSuccess, immediate, delay, deps, initialData, formatData, ...watchOpts } = options;

	const status = reactive({ ...initStatus, data: isFunction(initialData) ? initialData() : initialData });

	let currId = 0;

	const handler = async (id = ++currId) => {
			status.loading = true;

			const handleStatus: Partial<AsyncStatus> = { isError: false };

			try {
				handleStatus.data = await service();
			} catch (error) {
				handleStatus.isError = true;
				handleStatus.error = error;
			}

			if (id === currId) {
				if (isFunction(formatData)) {
					try {
						handleStatus.data = formatData(handleStatus.data);
					} catch (error) {
						handleStatus.isError = true;
						handleStatus.error = error;
					}
				}

				delay && (await timeOut(delay));

				handleStatus.loading = false;

				if (handleStatus.isError) {
					isFunction(onError) && onError(handleStatus.error);
				} else {
					isFunction(onSuccess) && onSuccess(handleStatus.data);
				}

				extend(status, handleStatus);
			}
		},
		run = async () => (await handler(), status.data),
		cancel = () => {
			status.loading = false;
			++currId;
		},
		mutation = (mutate: Getter<any>) => {
			return isFunction(mutate) ? (status.data = mutate(status.data)) : (status.data = mutate);
		};

	immediate && run();

	deps && watch(deps, async () => await handler(), watchOpts);

	return extend(toRefs(status), { run, cancel, mutation });
};

export default userAsync;
