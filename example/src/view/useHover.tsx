import { defineComponent, ref } from 'vue';

import { useHover } from '../hooks';
const message = {
	success: console.log,
};

const style = {
	margin: 'auto',
	border: '1px solid #aaa',
	width: '100px',
	height: '100px',
	lineHeight: '100px',
};

export default defineComponent(() => {
	const dom = ref();

	const isHover = useHover(dom, {
		enter() {
			message.success('enter');
		},
		leave() {
			message.success('leave');
		},
	});

	return () => (
		<>
			<div ref={dom} style={style}>
				{isHover.value}
			</div>
		</>
	);
});
