// import { computed, defineComponent, ref, watchEffect } from 'vue';
import { defineComponent } from 'vue';
import { useRequest, useBoolean } from '../../hooks';
// import { message } from 'ant-design-vue';

// const Mock = (window as any).Mock;

// const getUserName = useRequest.create<number | void>({
// 	requestMethod(id) {
// 		return new Promise((resolve) => {
// 			setTimeout(() => {
// 				console.log('userid', id);
// 				resolve(Mock.mock('@name'));
// 			}, 1000);
// 		});
// 	},
// });
// export const Demo = defineComponent(() => {
// 	const { loading, data } = getUserName(10086);

// 	return () => (
// 		<>
// 			<div>{loading.value ? 'loading' : data.value}</div>
// 		</>
// 	);
// });

// const changeUserName = useRequest.create<string>({
// 	requestMethod() {
// 		return new Promise((resolve, reject) => {
// 			setTimeout(() => {
// 				if (Math.random() > 0.5) {
// 					resolve({ success: true });
// 				} else {
// 					reject({ success: false });
// 				}
// 			}, 1000);
// 		});
// 	},
// });
// export const Demo2 = defineComponent(() => {
// 	const userName = ref('');

// 	const { loading, run } = changeUserName(userName.value, { immediate: false });

// 	return () => (
// 		<>
// 			<div>
// 				<input
// 					onChange={(e: any) => (userName.value = e.target.value)}
// 					value={userName.value}
// 					placeholder="Please enter username"
// 					style={{ width: '240px', marginRight: '16px' }}
// 				/>
// 				<button
// 					disabled={loading.value}
// 					type="button"
// 					onClick={() =>
// 						run(userName.value)
// 							.then(() => {
// 								message.success('changeUserName success');
// 							})
// 							.catch(() => {
// 								message.error('changeUserName fail');
// 							})
// 					}
// 				>
// 					{loading.value ? 'loading' : 'Edit'}
// 				</button>
// 			</div>
// 		</>
// 	);
// });

// export const Demo3 = defineComponent(() => {
// 	const { loading, data, run, cancel } = getUserName(10087, {
// 		polling: 2000,
// 		immediate: false,
// 	});

// 	return () => (
// 		<>
// 			<p>Username: {loading.value ? 'loading' : data.value}</p>
// 			<button type="button" onClick={() => run()}>
// 				start
// 			</button>
// 			<button type="button" onClick={cancel} style={{ marginLeft: 8 }}>
// 				stop
// 			</button>
// 		</>
// 	);
// });
// const getUserId = useRequest.create<void>({
// 	requestMethod() {
// 		return new Promise((resolve) => {
// 			setTimeout(() => {
// 				resolve(12580);
// 			}, 1000);
// 		});
// 	},
// });

// export const Demo4 = defineComponent(() => {
// 	const { loading, data } = getUserId();

// 	const { loading: nameLoading, data: nameData } = getUserName(data, {
// 		ready: [computed(() => !loading.value)],
// 	});

// 	return () => (
// 		<>
// 			<div>
// 				<p>UserId: {loading.value ? 'loading' : data.value}</p>
// 				<p>Username: {nameLoading.value ? 'loading' : nameData.value}</p>
// 			</div>
// 		</>
// 	);
// });

// const getEmail = useRequest.create<string>({
// 	requestMethod(search: string) {
// 		return new Promise((resolve) => {
// 			setTimeout(() => {
// 				console.log('email:', search);
// 				resolve(Mock.mock({ 'data|5': ['@email'] }).data);
// 			}, 300);
// 		});
// 	},
// });
// export const Demo5 = defineComponent(() => {
// 	const { data, loading, run } = getEmail('email', { debounce: 1000, immediate: false, leading: false });

// 	return () => (
// 		<>
// 			<div>
// 				<p>input quickly to see the effect</p>
// 				<input
// 					placeholder="Select Emails"
// 					onInput={(e: any) => run(e.target.value).then(() => message.success('1229427818'))}
// 				/>
// 				{loading.value ? (
// 					<p>loading</p>
// 				) : (
// 					<ul style={{ marginTop: '8px', listStyle: 'none' }}>
// 						{data.value?.map((i) => (
// 							<li key={i}>{i}</li>
// 						))}
// 					</ul>
// 				)}
// 			</div>
// 		</>
// 	);
// });

// export const Demo6 = defineComponent(() => {
// 	const { data, loading, run } = getEmail('email', { throttle: 1000, immediate: false, leading: false });

// 	return () => (
// 		<>
// 			<div>
// 				<p>input quickly to see the effect</p>
// 				<input placeholder="Select Emails" onInput={(e: any) => run(e.target.value)} />
// 				{loading.value ? (
// 					<p>loading</p>
// 				) : (
// 					<ul style={{ marginTop: '8px', listStyle: 'none' }}>
// 						{data.value?.map((i) => (
// 							<li key={i}>{i}</li>
// 						))}
// 					</ul>
// 				)}
// 			</div>
// 		</>
// 	);
// });

// const getArticle = useRequest.create<number>({
// 	requestMethod(id: number) {
// 		return new Promise((resolve) => {
// 			setTimeout(() => {
// 				console.log('articleid', id);
// 				resolve({
// 					data: Mock.mock('@paragraph'),
// 					time: new Date().getTime(),
// 				});
// 			}, 1000);
// 		});
// 	},
// });

// export const Demo7 = defineComponent(() => {
// 	const [show, toggle] = useBoolean(false);

// 	const { data, run } = getArticle(10086, {
// 		immediate: false,
// 		cacheKey: 'article',
// 		cacheTime: 5000,
// 	});

// 	watchEffect(() => {
// 		show.value && run();
// 	});

// 	return () => (
// 		<>
// 			<div>
// 				<p>You can click the button multiple times, the article component will show the cached data first.</p>
// 				<p>
// 					<button type="button" onClick={toggle}>
// 						show/hidden
// 					</button>
// 				</p>
// 				{show.value && (
// 					<>
// 						<p>Latest request time: {data.value?.time}</p>
// 						<p>{data.value?.data}</p>
// 					</>
// 				)}
// 			</div>
// 		</>
// 	);
// });

// export const Demo8 = defineComponent(() => {
// 	const text = ref('');

// 	const requestName = getUserName(10086);
// 	requestName.then((data) => (text.value = data));

// 	return () => (
// 		<div>
// 			<p>usrename: {requestName.data.value}</p>
// 			<input
// 				onChange={(e: any) => (text.value = e.target.value)}
// 				value={text.value}
// 				placeholder="Please enter username"
// 				style={{ width: 240, marginRight: 16 }}
// 			/>
// 			<button type="button" onClick={() => requestName.mutation(text.value)}>
// 				Edit
// 			</button>
// 		</div>
// 	);
// });

const get = async () => {
	const res = await useRequest('http://localhost/api/theme', {
		cacheKey: 'theme',
		cacheTime: 5000,
		formatData(res) {
			if (!res) return void 0;

			const { errorCode, errorMsg, result } = res;
			if (errorCode === 0) return result;
			else throw errorMsg;
		},
	});
	console.log(res);
	return res;
};

export const cacheDemo = defineComponent(() => {
	return () => (
		<>
			<button onClick={() => get()}>click</button>
		</>
	);
});
