import { defineComponent, ref } from "vue";
import { useLazyLoad } from "../hooks";
const Demo = defineComponent(() => {
	// 'https://img.yzcdn.cn/vant/apple-1.jpg',

	const dom = ref(),
		imgList = ref(
			Array(8)
				.fill("")
				.map((_, i) => `https://img.yzcdn.cn/vant/apple-${i + 1}.jpg`)
		);

	useLazyLoad(dom, { loading: "https://img.yzcdn.cn/vant/cat.jpeg" });

	return () => (
		<>
			<div ref={dom} style={{ width: "300px", margin: "auto" }}>
				{imgList.value.map((src) => (
					<img data-src={src} style={{ width: "300px", height: "300px" }} />
				))}
			</div>
		</>
	);
});

export default Demo;
