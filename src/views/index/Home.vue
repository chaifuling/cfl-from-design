<template>
  <a-layout id="components-layout-demo-fixed-sider">
    <a-layout-sider
      :collapsed-width="0"
      :width="250"
      theme="light"
      :style="{ overflow: 'auto', height: '100vh', position: 'fixed' }"
    >
      <div class="left-header" v-if="title">
        <h3>{{ title }}</h3>
      </div>
      <div class="left-main">
        <div v-for="(item, listIndex) in leftComponents" :key="listIndex">
          <a-divider orientation="left">
            <control-outlined />
            {{ tFn(item.title) }}
          </a-divider>
          <draggable
            class="components-draggable"
            :list="item.list"
            :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
            :clone="cloneComponent"
            draggable=".components-item"
            :sort="false"
            :item-key="listIndex"
            @end="onEnd"
          >
            <template #item="{ element, index }">
              <div
                :key="index"
                class="components-item"
                @click="addComponent(element)"
              >
                <div
                  class="components-body"
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: left;
                  "
                >
                  <img
                    :src="allIcon[element.__config__.tagIcon]"
                    class="components-body-img"
                    style="margin-right: 4px"
                  />
                  {{ tFn(element.__config__.label) }}
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </a-layout-sider>
    <a-layout :style="{ marginLeft: '250px', marginRight: '350px' }">
      <a-layout-header
        :style="{ background: '#fff', padding: 0 }"
        class="center-header"
      >
        <!-- TODO: 运行功能 本地可以  npm包模式 后面再解决兼容问题 -->
        <!-- <a-button  type="link" size="small" @click="run">
          <play-circle-outlined />
          {{ tFn("base.run") }}
        </a-button> -->
        <a-divider type="vertical" />
        <a-button type="link" size="small" @click="showJson">
          <eye-outlined />
          {{ tFn("base.view.json") }}
        </a-button>
        <a-divider type="vertical" />
        <a-button type="link" size="small" @click="download">
          <cloud-download-outlined />
          {{ tFn("base.export.vue.file") }}
        </a-button>
        <a-divider type="vertical" />
        <a-button size="small" type="link" @click="copy">
          <copy-outlined />
          {{ tFn("base.copy.code") }}
        </a-button>
        <a-divider type="vertical" />
        <a-button size="small" type="link" @click="empty">
          <delete-outlined />
          {{ tFn("base.empty") }}
        </a-button>
        <a-divider type="vertical" />
        <a-button size="small" type="link" @click="save">
          <save-outlined />
          {{ tFn("base.save") }}
        </a-button>
        <select-lang class="select-lang-trigger" />
      </a-layout-header>
      <div class="center-main">
        <a-layout-content>
          <div class="center-board-row">
            <a-form
              :label-align="formConf.labelAlign"
              :layout="formConf.layout"
              :label-col="
                formConf.layout === 'horizontal' ? formConf.labelCol : null
              "
              :wrapper-col="
                formConf.layout === 'horizontal' ? formConf.wrapperCol : null
              "
              :size="formConf.size"
              :disabled="formConf.disabled"
            >
              <draggable
                class="drawing-board"
                style="min-height: 200px"
                :list="drawingList"
                :animation="340"
                group="componentsGroup"
              >
                <template #item="{ element, index }">
                  <draggable-item
                    v-bind="$attrs"
                    :key="index"
                    :drawing-list="drawingList"
                    :current-item="element"
                    :index="index"
                    :active-id="activeId"
                    :form-conf="formConf"
                    :showIcon="true"
                    @activeItem="activeFormItem"
                    @copyItem="drawingItemCopy"
                    @deleteItem="drawingItemDelete"
                  />
                </template>
              </draggable>
              <a-result
                v-show="!drawingList.length"
                :title="tFn('base.left.drag')"
              >
                <template #icon>
                  <insert-row-below-outlined />
                </template>
                <template #extra />
              </a-result>
            </a-form>
          </div>
        </a-layout-content>
        <a-layout-footer :style="{ textAlign: 'center' }">
          ©2022
          <a href="https://github.com/fuzui/JDGT-antdv" target="_blank">JDGT</a>
        </a-layout-footer>
      </div>
    </a-layout>
    <a-layout-sider
      :style="{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        right: 0,
      }"
      :collapsed-width="0"
      :width="350"
      theme="light"
    >
      <right-panel
        :active-data="activeData"
        :form-conf="formConf"
        :show-field="!!drawingList.length"
        @tag-change="tagChange"
        @fetch-data="fetchData"
      />
    </a-layout-sider>
    <form-drawer
      ref="formDrawer"
      :form-data="formData"
      size="100%"
      :generate-conf="generateConf"
    />
    <json-drawer ref="jsonDrawer" size="60%" @refresh="refreshJson" />
    <code-type-modal ref="codeTypeModal" @confirm="generate" />
    <input id="copyNode" type="hidden" />
    <a-modal
      :title="tFn('base.save')"
      :visible="showSave"
      @cancel="handleColse"
    >
      <a-form
        ref="elForm"
        :model="savaFormData"
        size="medium"
        :labelCol="{ span: 4 }"
        :wrapperCol="{ span: 24 }"
        label-width="100px"
      >
        <a-form-item :label="tFn('base.form.name')" props="name" v-bind="validateInfos.name">
          <a-input
            v-model:value="savaFormData.name"
            :placeholder="tFn('base.enter')"
            allow-clear
            @blur="validate('name', { trigger: 'blur' }).catch(() => {})"
          />
        </a-form-item>
        <a-form-item :label="tFn('base.remark')" props="remark" v-bind="validateInfos.remark">
          <a-textarea
            v-model:value="savaFormData.remark"
            :placeholder="tFn('base.enter')"
          />
        </a-form-item>
        <a-form-item :label="tFn('base.status')" props="status">
          <a-radio-group
            v-model:value="savaFormData.status"
            button-style="solid"
          >
            <a-radio-button value="0">开启</a-radio-button>
            <a-radio-button value="1">关闭</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button @click="handleColse">
          {{ tFn("base.cancel") }}
        </a-button>
        <a-button type="primary" @click="handelConfirm">
          {{ tFn("base.ok") }}
        </a-button>
      </template>
    </a-modal>
  </a-layout>
</template>
<script>
import {
  defineComponent,
  reactive,
  ref,
  watch,
  onMounted,
  nextTick,
  refs,
  getCurrentInstance,
} from "vue";
import allIcon from "@/core/icons";
import draggable from "vuedraggable";
import { debounce } from "throttle-debounce";
import { saveAs } from "file-saver";
import ClipboardJS from "clipboard";
import render from "@/components/render/render";
import FormDrawer from "./FormDrawer";
import JsonDrawer from "./JsonDrawer";
import RightPanel from "./RightPanel";
import {
  inputComponents,
  selectComponents,
  layoutComponents,
} from "@/components/generator/config";
import {
  beautifierConf,
  stringify,
  titleCase,
  deepClone,
  isObjectObject,
} from "@/utils/index";
import {
  makeUpHtml,
  vueTemplate,
  vueScript,
  cssStyle,
} from "@/components/generator/html";
import { makeUpJs } from "@/components/generator/js";
import { makeUpCss } from "@/components/generator/css";
import drawingDefalut from "@/components/generator/drawingDefalut";
import logo from "@/assets/logo.png";
import CodeTypeModal from "./CodeTypeModal";
import DraggableItem from "./DraggableItem";
import { DRAWING_ITEMS, DRAWING_ID } from "@/store/mutation-types";
import loadBeautifier from "@/utils/loadBeautifier";
import SelectLang from "@/components/SelectLang";
import { tFn } from "@/hook/useI18n";
import { baseMixin } from "@/store/app-mixin";
import { notification } from "ant-design-vue";
import axios from "axios";
import { Form } from "ant-design-vue";
import {
  PlayCircleOutlined,
  EyeOutlined,
  CloudDownloadOutlined,
  CopyOutlined,
  DeleteOutlined,
  InsertRowBelowOutlined,
  ControlOutlined,
  SaveOutlined,
} from "@ant-design/icons-vue";
let beautifier;
let tempActiveData;
const useForm = Form.useForm;

export default defineComponent({
  name: "fromDesign",
  components: {
    draggable,
    render,
    FormDrawer,
    JsonDrawer,
    RightPanel,
    CodeTypeModal,
    DraggableItem,
    SelectLang,
    PlayCircleOutlined,
    EyeOutlined,
    CloudDownloadOutlined,
    CopyOutlined,
    DeleteOutlined,
    InsertRowBelowOutlined,
    ControlOutlined,
    SaveOutlined,
  },
  emits: ["save"],
  mixins: [baseMixin],
  props: {
    fromConfig: {
      type:Object,
      default:{}
    },
    title: String,
  },
  setup(props, { emit }) {
    const instance = getCurrentInstance(); // 获取当前实例
    const showSave = ref(false); // 定义一个showSave变量，并将其初始化为false（使用Vue响应式引用）
    let collapsed = reactive(false); // 定义一个collapsed变量，并将其初始化为false（使用Vue响应式对象）
    const savaFormData = reactive({
      // 定义一个savaFormData对象（使用Vue响应式对象）
      name: props.fromConfig.name || "", // 设置name属性值为props中传入的name，如果不存在则为空字符串
      remark: props.fromConfig.remark || "", // 设置remark属性值为props中传入的remark，如果不存在则为空字符串
      status: props.fromConfig.status || "0", // 设置status属性值为props中传入的status，如果不存在则为'0'
    });
    const rulesRef = reactive({
      // 定义一个rulesRef对象（使用Vue响应式对象）
      name: [
        // 定义name属性为数组
        {
          required: true, // 设置为必填项
          message: tFn("base.enter"), // 提示信息为'请输入'
        },
      ],
      remark: [
        // 定义remark属性为数组
        {
          required: true, // 设置为必填项
          message: tFn("base.enter"), // 提示信息为'请输入'
        },
      ],
    });
    const { resetFields, validate, validateInfos } = useForm(
      savaFormData,
      rulesRef
    ); // 使用Vue3的form表单验证机制，定义resetFields、validate、validateInfos三个函数
    let operationType = ref(""); // 定义一个operationType变量，并将其初始化为空字符串（使用Vue响应式引用）
    let drawingList = reactive(props.fromConfig.drawingList || drawingDefalut); // 定义一个drawingList变量，通过传入的props中的drawingList对象初始化，如果不存在则使用默认的drawingDefalut对象
    let drawingData = reactive({}); // 定义一个drawingData对象（使用Vue响应式对象）
    let formDrawer = ref(null); // 定义一个formDrawer变量，并将其初始化为null（使用Vue响应式引用）
    let jsonDrawer = ref(null); // 定义一个jsonDrawer变量，并将其初始化为null（使用Vue响应式引用）
    let codeTypeModal = ref(null); // 定义一个codeTypeModal变量，并将其初始化为null（使用Vue响应式引用）
    let formData = reactive({}); // 定义一个formData对象（使用Vue响应式对象）
    let activeData = reactive({}); // 定义一个activeData对象（使用Vue响应式对象）
    let oldActiveId = ref(null); // 定义一个oldActiveId变量，并将其初始化为null（使用Vue响应式引用）
    let drawingItems = ref(null); // 定义一个drawingItems变量，并将其初始化为null（使用Vue响应式引用）
    let idGlobal = ref(100); // 定义一个idGlobal变量，并将其初始化为100（使用Vue响应式引用）
    let generateConf = reactive({}); // 定义一个generateConf对象（使用Vue响应式对象）
    let formConf = reactive(props.fromConfig.formConf || {}); // 定义一个formConf变量，通过传入的props中的formConf对象初始化，如果不存在则为空对象（使用Vue响应式对象）
    let activeId = ref(drawingDefalut[0].formId); // 定义一个activeId变量，并将其初始化为drawingDefalut[0].formId的值（使用Vue响应式引用）
    let leftComponents = [
      // 定义一个leftComponents数组
      {
        title: "base.input_components", // 设置title属性值为'输入组件'
        list: inputComponents, // 设置list属性值为inputComponents数组对象
      },
      {
        title: "base.optional_components", // 设置title属性值为'可选组件'
        list: selectComponents, // 设置list属性值为selectComponents数组对象
      },
      {
        title: "base.layout_components", // 设置title属性值为'布局组件'
        list: layoutComponents, // 设置list属性值为layoutComponents数组对象
      },
    ];

    // 定义一个activeFormItem函数，用于激活当前表单项
    function activeFormItem(currentItem) {
      activeData.value = currentItem;
      activeId.value = currentItem.__config__.formId;
    }

    // 定义一个generateCode函数，用于生成代码
    function generateCode() {
      const { type } = generateConf.value;
      AssembleFormData();
      const script = vueScript(makeUpJs(formData, type));
      const html = vueTemplate(makeUpHtml(formData, type));
      const css = cssStyle(makeUpCss(formData));
      return beautifier.html(html + script + css, beautifierConf.html);
    }

    // 定义一个copyNode箭头函数，用于复制节点代码
    const copyNode = () => {
      const codeStr = generateCode();
      if (!codeStr) {
        return;
      }
      const clipboard = new ClipboardJS("#copyNode", {
        text: () => {
          return codeStr;
        },
      });
      clipboard.on("success", () => {
        notification.success({
          message: tFn("base.successfully"),
          description: tFn("base.code.copy.successfully"),
        });
        clipboard.destroy();
      });
      clipboard.on("error", () => {
        message.error(tFn("base.code.copy.failed"));
        clipboard.destroy();
      });
      const btn = document.getElementById("copyNode");
      btn.click();
    };

    if (Array.isArray(drawingItems) && drawingItems.length > 0) {
      drawingList = reactive(drawingItems);
    } else {
      drawingList = reactive(drawingDefalut);
    }
    activeFormItem(drawingList[0]);

    watch(
      () => activeData.value.__config__.label,
      (val, oldVal) => {
        if (
          activeData.value.placeholder === undefined ||
          !activeData.value.__config__.tag ||
          oldActiveId.value !== activeId.value ||
          activeData.value.__config__.tag !== "a-range-picker"
        ) {
          return;
        }
        // activeData.placeholder =
        //   activeData.placeholder.replace(oldVal, '') + val;
      }
    );
    // 监听activeData.__config__.label的变化
    watch(
      "activeId",
      (val) => {
        oldActiveId.value = val;
      },
      { immediate: true }
    );
    // 监听activeId的变化
    watch(
      "drawingList",
      (val) => {
        debounce(340, $store.commit(DRAWING_ITEMS, val));
        if (val.length === 0) {
          debounce(340, $store.commit(DRAWING_ID, 100));
        }
      },
      { deep: true }
    );

    // 在页面挂载后执行以下操作
    onMounted(() => {
      const clipboard = new ClipboardJS("#copyNode", {
        text: (trigger) => {
          const codeStr = generateCode();
          notification.success({
            message: tFn("base.successfully"),
            description: tFn("base.code.copy.successfully"),
          });
          return codeStr;
        },
      });
      clipboard.on("error", (e) => {
        message.error(tFn("base.code.copy.failed"));
      });

      if (Array.isArray(drawingItems) && drawingItems.length > 0) {
        drawingList = drawingItems;
      } else {
        drawingList = drawingDefalut;
      }
      activeFormItem(drawingList[0]);

      loadBeautifier((btf) => {
        beautifier = btf;
      });
    });

    // 递归设置对象属性值的函数
    function setObjectValueReduce(obj, strKeys, data) {
      const arr = strKeys.split(".");
      arr.reduce((pre, item, i) => {
        if (arr.length === i + 1) {
          pre[item] = data;
        } else if (!isObjectObject(pre[item])) {
          pre[item] = {};
        }
        return pre[item];
      }, obj);
    }

    // 设置响应数据的函数
    function setRespData(component, resp) {
      const { dataPath, renderKey, dataConsumer } = component.__config__;
      if (!dataPath || !dataConsumer) return;
      const respData = dataPath
        .split(".")
        .reduce((pre, item) => pre[item], resp);

      this.setObjectValueReduce(component, dataConsumer, respData);
      const i = this.drawingList.findIndex(
        (item) => item.__config__.renderKey === renderKey
      );
      if (i > -1) {
        this.drawingList[i] = component;
      }
    }

    // 获取响应数据的函数
    function fetchData(component) {
      const { dataType, method, url } = component.__config__;

      if (dataType === "dynamic" && method && url) {
        setLoading(component, true);
        axios({
          method,
          url,
        }).then((resp) => {
          setLoading(component, false);
          setRespData(component, resp.data);
        });
      }
    }

    // 设置表单项的 loading 状态的函数
    function setLoading(component, val) {
      const { directives } = component;
      if (Array.isArray(directives)) {
        const t = directives.find((d) => d.name === "loading");
        if (t) t.value = val;
      }
    }

    // 拖拽表单项结束时执行的函数
    function onEnd(obj) {
      if (obj.from !== obj.to) {
        fetchData(tempActiveData);
        activeData.value = tempActiveData;
        activeId.value = idGlobal.value;
      }
    }

    // 添加表单项的函数
    function addComponent(item) {
      const clone = cloneComponent(item);
      fetchData(clone);
      drawingList.push(clone);
      activeFormItem(clone);
    }

    // 克隆表单项的函数
    function cloneComponent(origin) {
      const clone = deepClone(origin);
      if (clone.__config__) {
        if (clone.__config__.label) {
          clone.__config__.label = tFn(clone.__config__.label);
        }
        if (clone.__config__.document) {
          clone.__config__.document = tFn(clone.__config__.document);
        }
      }
      if (clone.placeholder) {
        if (clone.__config__.tag == "a-range-picker") {
          clone.placeholder = clone.placeholder;
        } else {
          clone.placeholder = tFn(clone.placeholder);
        }
      }
      if (clone.__config__.tag === "a-button") {
        clone.__slot__.default = tFn(clone.__slot__.default);
      }
      if (clone.__config__.tag === "a-upload") {
        clone.__config__.buttonText = tFn(clone.__config__.buttonText);
      }
      const config = clone.__config__;
      createIdAndKey(clone);
      if (
        clone.placeholder !== undefined &&
        clone.__config__.tag !== "a-range-picker"
      ) {
        clone.placeholder += config.label;
      }
      tempActiveData = clone;
      return tempActiveData;
    }
    // 为表单项设置唯一 ID 和 renderKey 的函数
    function createIdAndKey(item) {
      const config = item.__config__;
      idGlobal.value = idGlobal.value + 1;
      config.formId = idGlobal.value;
      config.renderKey = `${config.formId}${+new Date()}`;
      if (config.layout === "colFormItem") {
        item.__vModel__ = `field${idGlobal.value}`;
      } else if (config.layout === "rowFormItem") {
        config.componentName = `row${idGlobal.value}`;
        !Array.isArray(config.children) && (config.children = []);
        delete config.label;
      }
      if (Array.isArray(config.children)) {
        config.children = config.children.map((childItem) =>
          createIdAndKey(childItem)
        );
      }
      return item;
    }
    // 组装表单数据的函数
    function AssembleFormData() {
      formData = {
        fields: deepClone(drawingList),
        ...formConf,
      };
    }
    // 生成代码的函数
    function generate(data) {
      const func = instance.proxy[`exec${titleCase(operationType.value)}`];
      generateConf.value = data;
      func && func(data);
    }
    // 运行表单
    function execRun(data) {
      AssembleFormData();
      formDrawer.value.onOpen(formData, generateConf.value);
    }
    // 下载vue文件
    function execDownload(data) {
      const codeStr = generateCode();
      const blob = new Blob([codeStr], { type: "text/plain;charset=utf-8" });
      saveAs(blob, data.fileName);
    }
    // 复制vue代码
    function execCopy(data) {
      document.getElementById("copyNode").click();
    }
    // 清空
    function empty() {
      $confirm({
        title: tFn("base.confirm.empty.components"),
        onOk() {
          drawingList.length = 0;
          idGlobal.value = 100;
        },
      });
    }
    // 打开保存
    function save() {
      showSave.value = true;
    }
    // 保存
    function handelConfirm() {
      validate()
        .then(() => {
          const from = {
            conf: JSON.stringify(formConf), // 表单配置
            fields: drawingList.map((item) => JSON.stringify(item)), // 表单项的数组
            ...savaFormData, // 表单名等
          };
          emit("save", from);
          resetFields();
          showSave.value = false;
        })
        .catch((err) => {
          console.log("error", err);
        });
    }
    // 复制表单单项
    function drawingItemCopy(item, list) {
      let clone = deepClone(item);
      clone = this.createIdAndKey(clone);
      list.push(clone);
      activeFormItem(clone);
    }

    // 删除表单单项
    function drawingItemDelete(index, list) {
      list.splice(index, 1);
      nextTick(() => {
        const len = drawingList.length;
        if (len) {
          activeFormItem(drawingList[len - 1]);
        }
      });
    }

    // 关闭弹窗
    function handleColse() {
      showSave.value = false;
      resetFields();
    }

    // 更新表单列表
    function updateDrawingList(newTag, list) {
      const index = list.findIndex(
        (item) => item.__config__.formId === activeId.value
      );
      if (index > -1) {
        list.splice(index, 1, newTag);
      } else {
        list.forEach((item) => {
          if (Array.isArray(item.__config__.children))
            updateDrawingList(newTag, item.__config__.children);
        });
      }
    }

    // 显示表单JSON配置
    function showJson() {
      AssembleFormData();
      jsonDrawer.value.onOpen(stringify(formData));
    }
    // 下载弹窗
    function download() {
      codeTypeModal.value.onOpen(true);
      operationType.value = "download";
    }
    // 运行弹窗
    function run() {
      codeTypeModal.value.onOpen(false);
      operationType.value = "run";
    }
    // 复制弹窗
    function copy() {
      codeTypeModal.value.onOpen(false);
      operationType.value = "copy";
    }

    // tag切换
    function tagChange(newTag) {
      newTag = cloneComponent(newTag);
      const config = newTag.__config__;
      newTag.__vModel__ = activeData.value.__vModel__;
      config.formId = activeId.value;
      config.span = activeData.value.__config__.span;
      activeData.value.__config__.tag = config.tag;
      activeData.value.__config__.tagIcon = config.tagIcon;
      activeData.value.__config__.document = config.document;
      if (
        typeof activeData.value.__config__.defaultValue ===
        typeof config.defaultValue
      ) {
        config.defaultValue = activeData.value.__config__.defaultValue;
      }
      Object.keys(newTag).forEach((key) => {
        if (activeData.value[key] !== undefined) {
          newTag[key] = activeData.value[key];
        }
      });
      activeData.value = newTag;
      updateDrawingList(newTag, drawingList);
    }

    function refreshJson(data) {
      drawingList = deepClone(data.fields);
      delete data.fields;
      formConf.value = data;
    }

    return {
      collapsed,
      drawingList,
      drawingData,
      formData,
      generateConf,
      activeId,
      activeData,
      leftComponents,
      allIcon,
      logo,
      inputComponents,
      selectComponents,
      layoutComponents,
      oldActiveId,
      activeFormItem,
      generateCode,
      copyNode,
      collapsed,
      drawingItems,
      drawingList,
      idGlobal,
      generateConf,
      formConf,
      activeData,
      setObjectValueReduce,
      setRespData,
      fetchData,
      setLoading,
      onEnd,
      addComponent,
      cloneComponent,
      createIdAndKey,
      AssembleFormData,
      generate,
      execRun,
      execDownload,
      execCopy,
      empty,
      drawingItemCopy,
      drawingItemDelete,
      updateDrawingList,
      showJson,
      download,
      run,
      copy,
      tagChange,
      refreshJson,
      formDrawer,
      codeTypeModal,
      jsonDrawer,
      tFn,
      save,
      showSave,
      savaFormData,
      title: props.title,
      validateInfos,
      validate,
      handelConfirm,
      handleColse,
    };
  },
});
</script>

<style lang="scss">
@import "@/styles/home.scss";
</style>
