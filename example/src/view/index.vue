<template>
	<div>
		<div v-for="hook in hooks" :key="hook">
			<router-link :to="hook">{{ hook }} </router-link>
		</div>
	</div>
</template>

<script lang="ts">
import * as hooks from "../hooks";

export default {
	setup() {
		return {
			hooks: Object.keys(hooks),
		};
	},
};
</script>
