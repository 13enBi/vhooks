import { defineComponent } from 'vue';

import { useBoolean } from '../hooks';

export default defineComponent(() => {
	const [bool, toggle] = useBoolean(false);

	return () => (
		<>
			<div style={{ marginBottom: '10px' }}>{bool.value}</div>

			<button onClick={toggle}>toggle</button>
			<button onClick={() => toggle(true)}>set true</button>
			<button onClick={() => toggle(false)}>set false</button>
		</>
	);
});
