<template>
  <div>
    <a-modal
      v-model:visible="visible"
      :title="tFn('base.choose.build.type')"
      width="500px"
      @ok="handelConfirm"
      @cancel="close"
    >
      <a-row :gutter="15">
        <a-form
          ref="elForm"
          :model="formData"
          :rules="rules"
          size="medium"
          label-width="100px"
        >
          <a-col :span="24">
            <a-form-item :label="tFn('base.build.type')" prop="type">
              <a-radio-group v-model:value="formData.type">
                <a-radio-button
                  v-for="(item, index) in typeOptions"
                  :key="index"
                  :value="item.value"
                  :disabled="item.disabled"
                >
                  {{ item.label }}
                </a-radio-button>
              </a-radio-group>
            </a-form-item>
            <a-form-item v-if="showFileName" :label="tFn('base.filename')" prop="fileName">
              <a-input v-model="formData.fileName" :placeholder="tFn('base.enter')" allow-clear />
            </a-form-item>
          </a-col>
        </a-form>
      </a-row>

      <template #footer>
        <a-button @click="close">
          {{ tFn('base.cancel') }}
        </a-button>
        <a-button type="primary" @click="handelConfirm">
          {{ tFn('base.ok') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts">
import  {defineComponent,computed,ref,reactive} from 'vue';
import { tFn } from '@/hook/useI18n';
export type CounterRef = ReturnType<typeof ref>;
export default defineComponent(
  {
  inheritAttrs: false,
  emits: ['confirm'],
  setup(props, { emit }) {

    const showFileName = ref(false);
    const visible = ref(false);
    const formData = reactive({
      fileName:`${+new Date()}.vue`,
      type: 'file'
    });

    const rules = computed(() => ({
      fileName: [{
        required: true,
        message: `${tFn('base.enter')}${tFn('base.filename')}`,
        trigger: 'blur'
      }],
      type: [{
        required: true,
        message: tFn('base.choose.build.type'),
        trigger: 'change'
      }]
    }));

    const onOpen = (showFileNames:any  ) => {
      showFileName.value = showFileNames;
      visible.value = true;
      if (showFileNames) {
        formData.fileName = `${+new Date()}.vue`;
      }
    };

    const close = () => {
      visible.value = false;
    };

    const handelConfirm = () => {
      if (formData.fileName) {
        emit('confirm', { ...formData });
        close();
      }
    };
    const typeOptions = computed(() => ([{
      label: tFn('base.page'),
      value: 'file'
    }, {
      label: tFn('base.modal'),
      value: 'modal'
    }]));

    return {
      showFileName,
      visible,
      formData,
      rules,
      typeOptions,
      onOpen,
      close,
      handelConfirm,
      tFn
    };
  }
})
</script>

<style lang="scss" scoped>

</style>
