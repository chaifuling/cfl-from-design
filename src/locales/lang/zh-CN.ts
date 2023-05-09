import antd from 'ant-design-vue/es/locale-provider/zh_CN'
import momentCN from 'moment'
import base from './zh-CN/base'
import tag from './zh-CN/tag'

const components = {
  antLocale: antd,
  momentName: 'zh-cn',
  momentLocale: momentCN
}

export default {
  message: '-',

  ...components,
  ...base,
  ...tag
}
