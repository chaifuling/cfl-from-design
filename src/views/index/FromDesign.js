

import FromDesign from './Home.vue'
import storePlugin from "@/store";
import axios from 'axios'
import { tFn } from '@/hook/useI18n';
// import Antd from 'ant-design-vue';

console.log('====================================');
console.log(FromDesign);
console.log('====================================');
// 为组件提供 install 安装方法，供按需引入
 FromDesign.install = function (app) {
  app.component(FromDesign.name, FromDesign)
  app.config.globalProperties.$axios=axios;
  app.config.globalProperties.tFn=tFn;
  app.use(storePlugin)
}

// 默认导出组件
export default FromDesign;