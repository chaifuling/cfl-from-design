// 导入组件
import FormDesign from './src/views/index/FormDesign';
import ViewPage from './src/views/index/ViewPages';
import {lang} from './src/locales/index';
import storePlugin from "./src/store";
import axios from 'axios'
import Antd from 'ant-design-vue';
import { tFn } from '@/hook/useI18n';

// 存储组件列表
const components = [
  FormDesign,
  ViewPage
]

// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，则所有的组件都将被注册
const install = function (app) {
  app.config.globalProperties.$axios=axios;
  app.config.globalProperties.tFn=tFn;
  app.use(storePlugin)
  app.use(Antd);
  // 判断是否安装
  if (install.installed) return
  // 遍历注册全局组件
  components.map(component => app.component(component.name, component))
}

// 判断是否是直接引入文件s
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  // 导出的对象必须具有 install，才能被 app.use() 方法安装
  install,
  // 以下是具体的组件列表
  FormDesign,
  ViewPage,
  lang
}
