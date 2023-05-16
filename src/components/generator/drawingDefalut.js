import { tFn } from '@/hook/useI18n';

export default [
 {
    // 组件的自定义配置
    __config__: {
      label: tFn('tag.input.label'),
      showLabel: true,
      changeTag: true,
      tag: 'a-input',
      tagIcon: 'inputIcon',
      defaultValue: undefined,
      required: true,
      layout: 'colFormItem',
      span: 24,
      document: 'tag.input.document',
      // 正则校验规则
      regList: []
    },
    // 组件的插槽属性
    __slot__: {
      addonBefore: '',
      addonAfter: ''
    },
    // 其余的为可直接写在组件标签上的属性
    // 'default-value': 'aaaa',
    placeholder: tFn('tag.input.label'),
    style: { width: '100%' },
    allowClear: true,
    maxLength: null,
    disabled: false,
    size: 'default',
    prefix: '',
    suffix: ''
  },
]
