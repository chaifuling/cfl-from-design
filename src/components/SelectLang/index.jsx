import {
   Menu, Dropdown, Space
} from 'ant-design-vue'
import i18nMixin from '@/store/i18n-mixin'
import {defaultLang} from '@/hook/useI18n'

const locales = ['zh-CN', 'en-US']
const languageLabels = {
  'zh-CN': '简体中文',
  'en-US': 'English'
}
const languageIcons = {
  'zh-CN': '🇨🇳',
  'en-US': '🇺🇸'
}

const SelectLang = {
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-drop-down'
    }
  },
  name: 'SelectLang',
  mixins: [i18nMixin],
  render() {
    const { prefixCls } = this
    const changeLang = ({ key }) => {
      defaultLang.value= key;
    }
    const langMenu = (
      <Menu class={['menu', 'ant-pro-header-menu']} selectedKeys={[defaultLang.value]} onClick={changeLang}>
        {locales.map(locale => (
          <Menu.Item key={locale}>
            <span role="img" aria-label={languageLabels[locale]}>
              {languageIcons[locale]}
            </span>{' '}
            {languageLabels[locale]}
          </Menu.Item>
        ))}
      </Menu>
    )
    return (
      <Dropdown overlay={langMenu} placement="bottomRight">
        <Space>
          {languageLabels[defaultLang.value]}
        </Space>
      </Dropdown>
    )
  }
}

export default SelectLang
