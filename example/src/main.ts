import { createApp } from 'vue';
import router from './router';
import App from './App';
import './index.css';
import store from './store';
import 'ant-design-vue/dist/antd.css';
import antd from 'ant-design-vue';

const app = createApp(App);

app.use(router).use(store).use(antd).mount('#app');
