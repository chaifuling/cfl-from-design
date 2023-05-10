

import FormDesign from './Home.vue'
import storePlugin from "@/store";
import axios from 'axios'
import { tFn } from '@/hook/useI18n';
// import Antd from 'ant-design-vue';

console.log('====================================');
console.log(FormDesign);
console.log('====================================');
// 为组件提供 install 安装方法，供按需引入
FormDesign.install = function (app) {
  app.component(FormDesign.name, FormDesign)
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.tFn = tFn;
  app.use(storePlugin)
}

// 默认导出组件
export default FormDesign;