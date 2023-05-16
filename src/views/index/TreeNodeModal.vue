<template>
  <a-modal
    :title="tFn('base.add.option')"
    :visible="visible"
    @ok="handelConfirm"
    @cancel="close"
  >
    <a-form ref="elForm" :model="formData" :rules="rules">
      <a-form-item :label="tFn('base.option.name')" prop="label">
        <a-input
          v-model:value="formData.label"
          :placeholder="tFn('base.enter') + tFn('base.option.name')"
          allow-clear
        />
      </a-form-item>
      <a-form-item :label="tFn('base.option.value')" prop="value">
        <a-input
          v-model:value="formData.value"
          :placeholder="tFn('base.enter') + tFn('base.option.value')"
          allow-clear
        >
          <a-select slot="addonAfter" v-model="dataType" style="width: 80px">
            <a-select-option
              v-for="(item, index) in dataTypeOptions"
              :key="index"
              :value="item.value"
              :disabled="item.disabled"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { isNumberStr } from "@/utils/index";
import { TREE_NODE_ID } from "@/store/mutation-types";
import { baseMixin } from "@/store/app-mixin";
import { defineComponent, ref, reactive, computed, watch } from "vue";
import { useStore } from "vuex";
import { tFn } from "@/hook/useI18n";

export default defineComponent({
  components: {},
  mixins: [baseMixin],
  inheritAttrs: false,
  props: [],
  emits: ["commit"],
  setup(props, { emit }) {
    const store = useStore();
    const visible = ref(false);
    const dataType = ref("string");
    let treeNodeId =store.state.app.treeNodeId;
    const elForm = ref(null);
    const formData = reactive({
      label: "",
      value: "",
    });
    const rules = computed(() => ({
      label: [
        {
          required: true,
          message: tFn("base.enter") + tFn("base.option.name"),
          trigger: "blur",
        },
      ],
      value: [
        {
          required: true,
          message: tFn("base.enter") + tFn("base.option.value"),
          trigger: "blur",
        },
      ],
    }));

    const dataTypeOptions = computed(() => [
      {
        label: tFn("base.string"),
        value: "string",
      },
      {
        label: tFn("base.number"),
        value: "number",
      },
    ]);
    watch(formData.value, (val) => {
      dataType.value = isNumberStr(val) ? "number" : "string";
    });

    watch(treeNodeId, (val) => {
      store.commit(TREE_NODE_ID, val);
    });
    function open() {
      formData.label = "";
      formData.value = "";
      visible.value = true;
    }

    function close() {
      visible.value = false;
    }

    function handelConfirm() {
      elForm.value.validate().then(res=>{
        if (dataType.value === "number") {
          formData.value = parseFloat(formData.value);
        }
        treeNodeId +=1;
        formData.id = treeNodeId;
        const  datas= {
          ...formData
        }
        emit("commit", datas);
        close();
      })
    }

    return {
      visible,
      dataType,
      treeNodeId,
      elForm,
      formData,
      rules,
      dataTypeOptions,
      open,
      close,
      handelConfirm,
    };
  },
});
</script>

<style lang="scss" scoped></style>
