<template>
  <a-modal
    v-model="visible"
    :title="tFn('base.export.file')"
    @ok="handelConfirm"
    @cancel="close"
  >
    <a-form
      ref="elForm"
      :model="formData"
      :rules="rules"
      size="medium"
      label-width="100px"
    >
      <a-form-item :label="tFn('base.filename')" prop="fileName">
        <a-input v-model="formData.fileName" :placeholder="tFn('base.enter')" allow-clear />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import {defineComponent} from 'vue';
export default defineComponent (
  {
  props: ['showFileName'],
  data() {
    return {
      visible: false,
      formData: {
        fileName: undefined
      }
    }
  },
  computed: {
    rules() {
      return {
        fileName: [{
          required: true,
          message: `${this.tFn('base.enter')}${this.tFn('base.filename')}`,
          trigger: 'blur'
        }]
      }
    }
  },
  watch: {},
  mounted() {},
  methods: {
    onOpen(suffix) {
      this.formData.fileName = `${+new Date()}.${suffix}`
      this.visible = true
    },
    onClose() {
    },
    close(e) {
      this.visible = false
    },
    handelConfirm() {
      this.$refs.elForm.validate(valid => {
        if (!valid) return
        this.$emit('confirm', this.formData.fileName)
        this.close()
      })
    }
  }
})
</script>
