import { defineComponent, ref } from 'vue';
import { useEventListener } from '../hooks';

const style = { width: '150px', height: '150px', border: '1px solid #ddd', lineHeight: '150px', margin: 'auto' };

const Demo = defineComponent(() => {
	const dom = ref<HTMLElement>(),
		count = ref(0);

	useEventListener(
		'click',
		() => {
			count.value++;
		},
		{ target: dom }
	);

	return () => (
		<>
			<h3>('click',handler)</h3>
			<h4>click {count.value} times</h4>
			<div style={style} ref={dom}>
				click
			</div>
		</>
	);
});

const Demo2 = defineComponent(() => {
	const dom = ref<HTMLElement>(),
		count = ref(0);

	useEventListener(
		['mouseleave', 'mouseenter'],
		() => {
			count.value++;
		},
		{ target: dom }
	);

	return () => (
		<>
			<h3>(["mouseleave", "mouseenter"],handler)</h3>
			<h4>mouseleave or mouseenter {count.value} times</h4>
			<div style={style} ref={dom}>
				enter or leave
			</div>
		</>
	);
});

const Demo3 = defineComponent(() => {
	const dom = ref<HTMLElement>(),
		count1 = ref(0),
		count2 = ref(0);

	useEventListener(
		'click',
		[
			() => {
				count1.value++;
			},
			() => {
				count2.value++;
			},
		],
		{ target: dom }
	);

	return () => (
		<>
			<h3>(click,[handler1,handler2])</h3>
			<h4>handler1:{count1.value} </h4>
			<h4>handler2:{count2.value} </h4>
			<div style={style} ref={dom}>
				2 click handler
			</div>
		</>
	);
});

const Demo4 = defineComponent(() => {
	const dom = ref<HTMLElement>(),
		count1 = ref(0),
		count2 = ref(0);

	useEventListener(
		['mouseenter', 'mouseleave'],
		[
			() => {
				count1.value++;
			},
			() => {
				count2.value++;
			},
		],
		{ target: dom }
	);

	return () => (
		<>
			<h3>(["mouseenter", "mouseleave"],[handleEnter, handleLeave])</h3>
			<h4>mouseenter {count1.value} times</h4>
			<h4>mouseleave {count2.value} times</h4>
			<div style={style} ref={dom}>
				enter and leave
			</div>
		</>
	);
});

export default defineComponent({
	setup() {
		return () => (
			<>
				<Demo></Demo>
				<Demo2></Demo2>
				<Demo3></Demo3>
				<Demo4></Demo4>
			</>
		);
	},
});
