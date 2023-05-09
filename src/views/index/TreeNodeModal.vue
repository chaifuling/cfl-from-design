<template>
  <a-modal
    :title="tFn('base.add.option')"
    :visible="visible"
    @ok="handelConfirm"
    @cancel="close"
  >
    <a-form
      ref="elForm"
      :model="formData"
      :rules="rules"
    >
      <a-form-item :label="tFn('base.option.name')" prop="label">
        <a-input v-model="formData.label" :placeholder="tFn('base.enter') + tFn('base.option.name')" allow-clear />
      </a-form-item>
      <a-form-item :label="tFn('base.option.value')" prop="value">
        <a-input
          v-model="formData.value"
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
import { isNumberStr } from '@/utils/index'
import { TREE_NODE_ID } from '@/store/mutation-types'
import { baseMixin } from '@/store/app-mixin'
import {defineComponent} from 'vue'

export default defineComponent({
  components: {},
  mixins: [baseMixin],
  inheritAttrs: false,
  props: [],
  data() {
    return {
      visible: false,
      formData: {
        label: undefined,
        value: undefined
      },
      dataType: 'string'
    }
  },
  computed: {
    rules() {
      return {
        label: [
          {
            required: true,
            message: this.tFn('base.enter') + this.tFn('base.option.name'),
            trigger: 'blur'
          }
        ],
        value: [
          {
            required: true,
            message: this.tFn('base.enter') + this.tFn('base.option.value'),
            trigger: 'blur'
          }
        ]
      }
    },
    dataTypeOptions() {
      return [
        {
          label: this.tFn('base.string'),
          value: 'string'
        },
        {
          label: this.tFn('base.number'),
          value: 'number'
        }
      ]
    }
  },
  watch: {
    // eslint-disable-next-line func-names
    'formData.value': function (val) {
      this.dataType = isNumberStr(val) ? 'number' : 'string'
    },
    treeNodeId(val) {
      this.$store.commit(TREE_NODE_ID, val)
    }
  },
  created() {},
  mounted() {},
  methods: {
    open() {
      this.formData = {
        label: undefined,
        value: undefined
      }
      this.visible = true
    },
    close() {
      this.visible = false
    },
    handelConfirm() {
      this.$refs.elForm.validate(valid => {
        if (!valid) return
        if (this.dataType === 'number') {
          this.formData.value = parseFloat(this.formData.value)
        }
        this.formData.id = this.treeNodeId++
        this.$emit('commit', this.formData)
        this.close()
      })
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
