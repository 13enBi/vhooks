import { watch } from 'vue';
import useDebounceFn from './useDebounceFn';

import { DebonunceOpts } from './useDebounceFn';
import { Deps, Func } from './utils';
import { WatchOptions } from 'vue';

export default (
	deps: Deps,
	fn: Func,
	{ wait = 0, leading = false, trailing = true, ...watchOpts }: DebonunceOpts & WatchOptions & { wait?: number } = {}
) => {
	[fn] = useDebounceFn(fn, wait);

	return watch(deps, fn, watchOpts);
};
