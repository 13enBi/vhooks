import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';

export default defineComponent(() => () => (
	<div id="app">
		<RouterView></RouterView>
	</div>
));
