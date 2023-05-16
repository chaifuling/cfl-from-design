## cfl-from-design

[![MIT](https://camo.githubusercontent.com/78f47a09877ba9d28da1887a93e5c3bc2efb309c1e910eb21135becd2998238a/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4c6963656e73652d4d49542d79656c6c6f772e737667)](https://github.com/chaifuling/cfl-from-design) [![github](https://camo.githubusercontent.com/2593e2bf2edcc00df7ccb0df75e3a6cd317ba513be5b3e313d0e71dfabc89725/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f417574686f722d7861626f792d626c75652e737667)](https://github.com/chaifuling)

### cfl-from-design 是基于 [****ant-design-vue****](**https://github.com/chaifuling/cfl-from-design**) vue3版本实现的表单设计器组件。可以通过拖拽的方式快速创建表单，提高开发者对表单的开发效率，节省开发者的时间。

***\*[****文档****](**开发中**) | [****在线演示****](**暂无**)\****

## ![image-20230516155053178](./public/image-20230516155053178.png)引入

**NodeJs:**

```
npm install cfl-from-design@next
```

请自行导入cfl-from-design并挂载

```
import FromDesign from 'cfl-from-design'
import 'cfl-from-design/lib/from-design.css'

  // 嵌入表单
  app.use(FromDesign)
```

## 使用

```
<template>
    <!-- 表单设计器 -->
   <form-design :formConfig="form" @save="hanleSave"></form-design> 
     <!-- 表单预览器 -->
    <form-view-page :formConfig="formConfig"></form-view-page>
</template>

<script scope>
import 'cfl-from-design/lib/from-design.css'
</script>

```



## 设置多语言

通过 locale 配置项设置语言, 内部自带支持多语言

```
<template>
  <form-design :locale="locale"></form-design>
</template>

<script>
export default {
  data(){
    return {
        locale: En,
    }
  }
}
</script>
```



## 组件`props`

- **formConfig**`formConfig` 表单的配置文件
- **save**`function` 组件保存后回调的配置
- **locale**`object` 设置多语言

## 





## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2023-caifuling