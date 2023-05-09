<template>
  <div class="view_page">
    <a-layout>
      <a-layout-content :style="{ padding: '0 50px', marginTop: '64px' }">
        <div
          :style="{ background: '#fff', padding: '24px', minHeight: '100vh' }"
        >
          <div v-for="item,index in drawingList">
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
        {{ formConf }}
      </a-layout-content>
      <a-layout-footer :style="{ textAlign: 'center' }"> </a-layout-footer>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
// @ts-ignore
import DraggableItem from "./DraggableItem";
// @ts-ignore
import drawingDefalut from "@/components/generator/drawingDefalut";

export default defineComponent({
  name: "fromViewPage",
  emits: ['change'],
  props:{
    fromConfig:Object,
  },
  components: {
    DraggableItem,
  },
  setup(props, { emit }) {
    let formConf = reactive({});
    let drawingList = reactive(props.fromConfig||drawingDefalut);
    let activeId = ref(drawingDefalut[0].formId);
    
    function formChange(index:string,list:any){
        drawingList[index] = list;
        emit('change',drawingList);
    };
    return {
      formConf,
      drawingList,
      activeId,
      formChange
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
