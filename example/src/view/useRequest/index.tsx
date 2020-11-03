import { defineComponent } from 'vue';
import * as Demos from './demo';

export default defineComponent(() => () => (
	<div style={{ padding: '100px 0' }}>
		{Object.values(Demos).map((Demo) => (
			<div style={{ marginTop: '100px' }}>
				<Demo></Demo>
			</div>
		))}
	</div>
));
