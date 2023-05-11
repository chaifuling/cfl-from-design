<template>
  <div class="view_page">
    <a-layout>
      <a-layout-content :style="{ padding: '0 50px', marginTop: '64px' }">
        <div
          :style="{ background: '#fff', padding: '24px', minHeight: '100vh' }"
        >
          <div v-for="(item, index) in drawingList">
            <draggable-item
              :drawing-list="drawingList"
              :current-item="item"
              :index="index"
              :active-id="activeId"
              :form-conf="formConf"
              :showIcon="false"
              :disabled="false"
              @fromChange="formChange"
            />
          </div>
        </div>
      </a-layout-content>
      <a-layout-footer :style="{ textAlign: 'center' }"> </a-layout-footer>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref ,watch} from "vue";
// @ts-ignore
import DraggableItem from "./DraggableItem";
// @ts-ignore
import drawingDefalut from "@/components/generator/drawingDefalut";

export default defineComponent({
  name: "formViewPage",
  emits: ["change"],
  components: {
    DraggableItem,
  },
  props: {
    formConfig: {
      type: Object,
      default: {
        id: 0,
        name: "",
        status: "",
        remark: "",
        formConf: {}, // 表单配置
        drawingList: drawingDefalut, // 表单项的数组
      },
    },
  },
  setup(props, { emit }) {
    let formConf = reactive({});
    let drawingList = reactive(props.formConfig.drawingList );
    let activeId = ref(props.formConfig.id );

    function formChange(index: string, list: any) {
      drawingList[index] = list;
      emit("change", drawingList);
    }
    // 定义一个activeFormItem函数，用于激活当前表单项
    function activeFormItem(currentItem: any) {
        console.log(currentItem);
        
    }
     // 复制表单单项
     function drawingItemCopy(item: any, list: any) {
 
    }
    function drawingItemDelete (){

    }

    watch(
      () => props.formConfig,
      (newVal) => {
        newVal.drawingList.forEach((item:any, index:number) => {
          drawingList.splice(index, 1, item);
        });
        Object.keys(newVal.formConf).forEach((item) => {
          // @ts-ignore
          formConf[item] = newVal.formConf[item];
        });
      },
      { deep: true }
    );
    return {
      drawingItemDelete,
      drawingItemCopy,
      activeFormItem,
      formConf,
      drawingList,
      activeId,
      formChange,
    };
  },
});
</script>

<style>
.view_page {
  width: 100%;
  height: 100%;
}
#components-layout-demo-fixed .logo {
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 24px 16px 0;
  float: left;
}
.site-layout .site-layout-background {
  background: #fff;
}

[data-theme="dark"] .site-layout .site-layout-background {
  background: #141414;
}
</style>
