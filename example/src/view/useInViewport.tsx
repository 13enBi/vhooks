import { defineComponent, ref } from "vue";

import { useInViewport } from "../hooks";

const Demo1 = defineComponent(() => {
	const dom = ref();

	const is = useInViewport(dom);

	return () => (
		<>
			<div>
				<div style={{ color: is.value ? "#87d068" : "#f50" }}>{is.value ? "visible" : "hidden"}</div>
			</div>

			<img
				style={{
					margin: "1000px auto",
					border: "1px solid #ccc",
					width: "100px",
					height: "100px",
				}}
				src="https://img.yzcdn.cn/ant-design-vue/cat.jpeg"
				ref={dom}
			></img>
		</>
	);
});

const Demo2 = defineComponent(() => {
	const container = ref(),
		dom = ref();

	const is = useInViewport(dom, { root: container });

	return () => (
		<>
			<h1>指定容器</h1>
			<div>
				<div style={{ color: is.value ? "#87d068" : "#f50" }}>{is.value ? "visible" : "hidden"}</div>
			</div>
			<div ref={container} style={{ overflow: "auto", height: "500px", border: "2px solid #aaa" }}>
				<img
					style={{
						margin: "1000px auto",
						border: "1px solid #ccc",
						width: "100px",
						height: "100px",
					}}
					src="https://img.yzcdn.cn/ant-design-vue/cat.jpeg"
					ref={dom}
				></img>
			</div>
		</>
	);
});

export default defineComponent(() => () => (
	<>
		<Demo1></Demo1>
		<Demo2></Demo2>
	</>
));
