import { deepClone } from '@/utils/index'
import { h ,resolveComponent} from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
// import {Cascader} from 'ant-design-vue'

const componentChild = {}
/**
 * 将./slots中的文件挂载到对象componentChild上
 * 文件名为key，对应JSON配置中的__config__.tag
 * 文件内容为value，解析JSON配置中的__slot__
 */
const slotsFiles = require.context('./slots', false, /\.js$/)
const keys = slotsFiles.keys() || []
keys.forEach(key => {
  const tag = key.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = slotsFiles(key).default
  componentChild[tag] = value
})

function vModel(dataObject, defaultValue, tag) {
  if(tag === "a-switch"){
    dataObject.checkedValue = !defaultValue;
    return
  }
  dataObject.value = defaultValue;
}

function mountSlotFiles(h, confClone, children) {
  const childObjs = componentChild[confClone.__config__.tag]
  if (childObjs) {
    Object.keys(childObjs).forEach(key => {
      const childFunc = childObjs[key]
      if (confClone.__slot__ && confClone.__slot__[key]) {
        children.push(childFunc(h, confClone, key))
      }
    })
  }
}

function emitEvents(confClone) {
  ['on', 'nativeOn'].forEach(attr => {
    const eventKeyList = Object.keys(confClone[attr] || {})
    eventKeyList.forEach(key => {
      const val = confClone[attr][key]
      if (typeof val === 'string') {
        confClone[attr][key] = event => this.$emit(val, event)
      }
    })
  })
}

function buildDataObject(confClone, dataObject) {
  Object.keys(confClone).forEach(key => {
    const val = confClone[key]
    if (key === '__vModel__') {
      vModel.call(this, dataObject, confClone.__config__.defaultValue, confClone.__config__.tag)
    } else if (dataObject[key] !== undefined) {
      if (dataObject[key] === null
        || dataObject[key] instanceof RegExp
        || ['boolean', 'string', 'number', 'function'].includes(typeof dataObject[key])) {
        dataObject[key] = val
      } else if (Array.isArray(dataObject[key])) {
        dataObject[key] = [...dataObject[key], ...val]
      } else {
        dataObject[key] = { ...dataObject[key], ...val }
      }
    } else {
      dataObject[key] = val
    }
  })

  // 清理属性
  clearAttrs(dataObject)
}

function clearAttrs(dataObject) {
  delete dataObject.__config__
  delete dataObject.__slot__
  delete dataObject.__methods__
}

function makeDataObject() {
  // 深入数据对象
  return {
    class: {},
    style: {},
    onChange:'',
    onInput:'',
  }
}

export default {
  props: {
    conf: {
      type: Object,
      required: true
    }
  },
  render() {
    const dataObject = makeDataObject()
    const confClone = deepClone(this.conf)
    const children =   this.$slots.default();
    // 如果slots文件夹存在与当前tag同名的文件，则执行文件中的代码
    mountSlotFiles.call(this, h, confClone, children)

    // 将字符串类型的事件，发送为消息
    emitEvents.call(this, confClone)

    // 将json表单配置转化为vue render可以识别的 “数据对象（dataObject）”
    buildDataObject.call(this, confClone, dataObject);
    const tagName =  resolveComponent(this.conf.__config__.tag);
    debugger
    // console.log(`${JSON.stringify(tagName)} ----------- ${JSON.stringify(dataObject)}`)
    // 针对上传组件
    if(this.conf.__config__.tag == 'a-upload'){
    const aButton =  resolveComponent('a-button');
      return h(tagName,dataObject, {
        default: () =>(<aButton ><div><UploadOutlined/>上传图片</div></aButton>)
      })
    }
    if(this.conf.__config__.tag == 'a-button'){
      const aButton =  resolveComponent('a-button');
        return h(tagName,dataObject, {
          default: () =>(<div>{dataObject.name}</div>)
        })
      }
    return h(tagName,dataObject)
  }
}
