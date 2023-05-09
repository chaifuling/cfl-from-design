import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import storePlugin from "@/store";
import Antd from 'ant-design-vue';
import {setupI18n} from '@/locales'
import axios from 'axios'
import { tFn } from '@/hook/useI18n';
import 'ant-design-vue/dist/antd.css';



const app = createApp(App);
app.config.globalProperties.$axios=axios;
app.config.globalProperties.tFn=tFn;
setupI18n(app);
app.use(storePlugin);
app.use(router);
app.use(Antd);
app.mount("#app");