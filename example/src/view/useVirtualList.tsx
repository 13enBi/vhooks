import { defineComponent, ref } from 'vue';
import { useVirtualList } from '../hooks';

const Demo = defineComponent(() => {
	const wrap = ref(),
		cont = ref(),
		input = ref();

	const [currentList, scrollTo] = useVirtualList(
		{ container: cont, wrap, list: Array.from(Array(100000).keys()) },
		{
			overscan: 5,
			itemHeight: 60,
		}
	);

	return () => (
		<>
			<div>
				<input ref={input} type="number" />
				<button
					onClick={() => {
						scrollTo(input.value.value);
					}}
				>
					scrollTo
				</button>
			</div>

			<div ref={cont} style={{ height: '300px', overflow: 'auto' }}>
				<div ref={wrap}>
					{currentList.value.map((ele) => (
						<div
							style={{
								height: '52px',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								border: '1px solid #e8e8e8',
								marginBottom: '8px',
							}}
							key={ele.index}
						>
							Row: {ele.data}
						</div>
					))}
				</div>
			</div>
		</>
	);
});

const Demo2 = defineComponent(() => {
	const wrap = ref(),
		cont = ref(),
		input = ref();

	const itemHeight = (_, item: number) => {
		return Math.min(item, 300);
	};

	const [currentList, scrollTo] = useVirtualList(
		{ container: cont, wrap, list: Array.from(Array(999).keys()) },
		{
			overscan: 10,
			itemHeight,
		}
	);

	return () => (
		<>
			<div>
				<input ref={input} type="number" />
				<button
					onClick={() => {
						scrollTo(input.value.value);
					}}
				>
					scrollTo
				</button>
			</div>

			<div ref={cont} style={{ height: '500px', overflow: 'auto', marginTop: '300px' }}>
				<div ref={wrap}>
					{currentList.value.map((ele) => (
						<div
							style={{
								height: `${itemHeight(0, ele.index)}px`,
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								border: '1px solid #e8e8e8',
								marginBottom: '8px',
							}}
							key={ele.index}
						>
							Row: {ele.data}
						</div>
					))}
				</div>
			</div>
		</>
	);
});

export default defineComponent(() => () => (
	<>
		<Demo></Demo>
		<Demo2></Demo2>
	</>
));
