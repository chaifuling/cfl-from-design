<template>
  <div>
    <a-tabs v-model:activeKey="currentTab" class="right-header">
      <a-tab-pane key="field" :tab="tFn('base.component.properties')" />
      <a-tab-pane key="form" :tab="tFn('base.form.properties')" />
    </a-tabs>
    <div class="right-main">
      <!-- 组件属性 -->
      <a-form
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        v-show="currentTab === 'field' && showField"
        size="small"
        label-width="90px"
      >
        <a-form-item
          v-if="activeData.__config__.changeTag"
          :label="tFn('base.component.type')"
        >
          <a-select
            v-model:value="activeData.__config__.tagIcon"
            :placeholder="tFn('base.choose') + tFn('base.component.type')"
            :style="{ width: '100%' }"
            @change="tagChange"
          >
            <a-select-opt-group
              v-for="group in tagList"
              :key="group.label"
              :label="group.label"
            >
              <a-select-option
                v-for="item in group.options"
                :key="item.__config__.label"
                :value="item.__config__.tagIcon"
              >
                <a-icon :component="allIcon[item.__config__.tagIcon]" />
                <span> {{ tFn(item.__config__.label) }}</span>
              </a-select-option>
            </a-select-opt-group>
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="activeData.__vModel__ !== undefined"
          :label="tFn('base.field.name')"
        >
          <a-input
            v-model:value="activeData.__vModel__"
            :placeholder="`${tFn('base.enter')}${tFn(
              'base.field.name'
            )} (v-model)`"
          />
        </a-form-item>
        <a-form-item
          v-if="activeData.__config__.componentName !== undefined"
          :label="tFn('base.component.name')"
        >
          {{ activeData.__config__.componentName }}
        </a-form-item>
        <a-form-item
          v-if="activeData.__config__.label !== undefined"
          :label="tFn('base.title')"
        >
          <a-input
            v-model:value="activeData.__config__.label"
            :placeholder="`${tFn('base.enter')}${tFn('base.title')}`"
            @input="changeRenderKey"
          />
        </a-form-item>
        <a-form-item
          v-if="activeData.__config__.tag === 'a-transfer'"
          :label="tFn('base.top.title')"
        >
          <a-input-group>
            <a-row :gutter="8">
              <a-col :span="12">
                <a-input
                  v-model:value="activeData.titles[0]"
                  :placeholder="tFn('base.source.title')"
                />
              </a-col>
              <a-col :span="12">
                <a-input
                  v-model:value="activeData.titles[1]"
                  :placeholder="tFn('base.target.title')"
                />
              </a-col>
            </a-row>
          </a-input-group>
        </a-form-item>
        <a-form-item
          v-if="
            activeData.placeholder !== undefined &&
            activeData.__config__.tag !== 'a-range-picker'
          "
          :label="tFn('base.placeholder')"
        >
          <a-input
            v-model:value="activeData.placeholder"
            :placeholder="`${tFn('base.enter')}${tFn('base.placeholder')}`"
            @input="changeRenderKey"
          />
        </a-form-item>
        <a-form-item
          v-if="activeData.__config__['start-placeholder'] !== undefined"
          :label="tFn('base.start.placeholder')"
        >
          <a-input
            v-model:value="activeData.__config__['start-placeholder']"
            :placeholder="`${tFn('base.enter')}${tFn('base.placeholder')}`"
            @change="changeStartPlaceholder"
          />
        </a-form-item>
        <a-form-item
          v-if="activeData.__config__['end-placeholder'] !== undefined"
          :label="tFn('base.end.placeholder')"
        >
          <a-input
            v-model:value="activeData.__config__['end-placeholder']"
            :placeholder="`${tFn('base.enter')}${tFn('base.placeholder')}`"
            @change="changeEndPlaceholder"
          />
        </a-form-item>
        <a-form-item
          v-if="activeData.__config__.span !== undefined"
          :label="tFn('base.form.grid')"
        >
          <a-slider
            v-model:value="activeData.__config__.span"
            :max="24"
            :min="1"
            :marks="{ 12: '' }"
            @change="spanChange"
          />
        </a-form-item>
        <a-form-item
          v-if="
            activeData.__config__.layout === 'rowFormItem' &&
            activeData.gutter !== undefined
          "
          :label="tFn('base.grid.space')"
        >
          <a-input-number
            v-model:value="activeData.gutter"
            :min="0"
            :placeholder="tFn('base.grid.space')"
          />
        </a-form-item>
        <a-form-item
          v-if="
            activeData.__config__.layout === 'rowFormItem' &&
            activeData.type !== undefined
          "
          :label="tFn('base.layout.model')"
        >
          <a-radio-group v-model:value="activeData.type" button-style="solid">
            <a-radio-button value="default"> default </a-radio-button>
            <a-radio-button value="flex"> flex </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-if="activeData.justify !== undefined && activeData.type === 'flex'"
          :label="tFn('base.horizontal.arrangement')"
        >
          <a-select
            v-model:value="activeData.justify"
            :placeholder="`${tFn('base.choose')}${tFn(
              'base.horizontal.arrangement'
            )}`"
            :style="{ width: '100%' }"
          >
            <a-select-option
              v-for="(item, index) in justifyOptions"
              :key="index"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="activeData.align !== undefined && activeData.type === 'flex'"
          :label="tFn('base.vertical.arrangement')"
        >
          <a-radio-group v-model:value="activeData.align" button-style="solid">
            <a-radio-button value="top"> top </a-radio-button>
            <a-radio-button value="middle"> middle </a-radio-button>
            <a-radio-button value="bottom"> bottom </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-if="activeData.style && activeData.style.width !== undefined"
          :label="tFn('base.component.width')"
        >
          <a-input
            v-model:value="activeData.style.width"
            :placeholder="`${tFn('base.enter')}${tFn('base.component.width')}`"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          v-if="activeData.__vModel__ !== undefined"
          :label="tFn('base.default.value')"
        >
          <a-input
            :value="setDefaultValue(activeData.__config__.defaultValue)"
            :placeholder="`${tFn('base.enter')}${tFn('base.default.value')}`"
            @input="onDefaultValueInput"
          />
        </a-form-item>
        <a-form-item
          v-if="activeData.prefix !== undefined"
          :label="tFn('base.prefix')"
        >
          <a-input
            v-model:value="activeData.prefix"
            :placeholder="tFn('base.prefix')"
          />
        </a-form-item>
        <a-form-item
          v-if="activeData.suffix !== undefined"
          :label="tFn('base.suffix')"
        >
          <a-input
            v-model:value="activeData.suffix"
            :placeholder="tFn('base.suffix')"
          />
        </a-form-item>
        <a-form-item
          v-if="activeData.__config__.tag === 'a-cascader'"
          :label="tFn('base.separator')"
        >
          <a-input
            v-model:value="activeData.separator"
            :placeholder="tFn('base.separator')"
          />
        </a-form-item>
        <a-form-item
          v-if="activeData.autoSize !== undefined"
          :label="tFn('base.min.row')"
        >
          <a-input-number
            v-model:value="activeData.autoSize.minRows"
            :min="1"
            placeholder="tFn('base.min.row')"
          />
        </a-form-item>
        <a-form-item
          v-if="activeData.autoSize !== undefined"
          :label="tFn('base.max.row')"
        >
          <a-input-number
            v-model:value="activeData.autoSize.maxRows"
            :min="1"
            :placeholder="tFn('base.max.row')"
          />
        </a-form-item>
        <a-form-item v-if="isShowMin" :label="tFn('base.min')">
          <a-input-number
            v-model:value="activeData.min"
            :placeholder="tFn('base.min')"
          />
        </a-form-item>
        <a-form-item v-if="isShowMax" :label="tFn('base.max')">
          <a-input-number
            v-model:value="activeData.max"
            :placeholder="tFn('base.max')"
          />
        </a-form-item>
        <a-form-item
          v-if="activeData.count !== undefined"
          :label="tFn('base.total')"
        >
          <a-input-number
            v-model:value="activeData.count"
            :placeholder="tFn('base.total')"
          />
        </a-form-item>
        <a-form-item
          v-if="activeData.height !== undefined"
          :label="tFn('base.component.height')"
        >
          <a-input-number
            v-model:value="activeData.height"
            :placeholder="tFn('base.component.height')"
            @input="changeRenderKey"
          />
        </a-form-item>
        <a-form-item v-if="isShowStep" :label="tFn('base.step')">
          <a-input-number
            v-model:value="activeData.step"
            :placeholder="tFn('base.step')"
          />
        </a-form-item>
        <a-form-item
          v-if="activeData.maxLength !== undefined"
          :label="tFn('base.most.enter')"
        >
          <a-input
            v-model:value="activeData.maxLength"
            :placeholder="tFn('base.maxlength')"
          >
            <template slot="append">
              {{ tFn("base.most.enter.after") }}
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          v-if="activeData['checked-children'] !== undefined"
          :label="tFn('base.checked')"
        >
          <a-input v-model:value="activeData['checked-children']" />
        </a-form-item>
        <a-form-item
          v-if="activeData['un-checked-children'] !== undefined"
          :label="tFn('base.unchecked')"
        >
          <a-input v-model:value="activeData['un-checked-children']" />
        </a-form-item>
        <a-form-item
          v-if="activeData.name !== undefined"
          :label="tFn('base.file.field.name')"
        >
          <a-input
            v-model:value="activeData.name"
            :placeholder="tFn('base.file.field.name')"
          />
        </a-form-item>
        <a-form-item
          v-if="activeData.accept !== undefined"
          :label="tFn('base.file.type')"
        >
          <a-select
            v-model:value="activeData.accept"
            :placeholder="tFn('base.choose')"
            :style="{ width: '100%' }"
            allow-clear
          >
            <a-select-option value="image/*">
              {{ tFn("base.image") }}
            </a-select-option>
            <a-select-option value="video/*">
              {{ tFn("base.video") }}
            </a-select-option>
            <a-select-option value="audio/*">
              {{ tFn("base.audio") }}
            </a-select-option>
            <a-select-option value=".xls,.xlsx"> excel </a-select-option>
            <a-select-option value=".doc,.docx"> word </a-select-option>
            <a-select-option value=".pdf"> pdf </a-select-option>
            <a-select-option value=".txt"> txt </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="activeData.__config__.fileSize !== undefined"
          :label="tFn('base.file.size')"
        >
          <a-input
            v-model.number:value="activeData.__config__.fileSize"
            :placeholder="tFn('base.enter')"
          >
            <a-select
              slot="append"
              v-mode:valuel="activeData.__config__.sizeUnit"
              :style="{ width: '66px' }"
            >
              <a-select-option value="KB"> KB </a-select-option>
              <a-select-option value="MB"> MB </a-select-option>
              <a-select-option value="GB"> GB </a-select-option>
            </a-select>
          </a-input>
        </a-form-item>
        <a-form-item
          v-if="activeData.action !== undefined"
          :label="tFn('base.upload.url')"
        >
          <a-input
            v-model:value="activeData.action"
            :placeholder="tFn('base.enter')"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          v-if="activeData['list-type'] !== undefined"
          :label="tFn('base.list.type')"
        >
          <a-radio-group v-model:value="activeData['list-type']" button-style="solid">
            <a-radio-button value="text"> text </a-radio-button>
            <a-radio-button value="picture"> picture </a-radio-button>
            <a-radio-button value="picture-card"> picture-card </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-if="
            activeData.type !== undefined &&
            activeData.__config__.tag === 'a-button'
          "
          :label="tFn('base.button.type')"
        >
          <a-select v-model:value="activeData.type" :style="{ width: '100%' }">
            <a-select-option value="default"> default </a-select-option>
            <a-select-option value="primary"> primary </a-select-option>
            <a-select-option value="dashed"> dashed </a-select-option>
            <a-select-option value="danger"> danger </a-select-option>
            <a-select-option value="link"> link </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="activeData.__config__.tag === 'a-button'"
          :label="tFn('base.button.shape')"
        >
          <a-select
            v-model:value="activeData.shape"
            :style="{ width: '100%' }"
            allow-clear
          >
            <a-select-option value="circle"> circle </a-select-option>
            <a-select-option value="round"> round </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="activeData.__config__.tag === 'a-button'"
          :label="tFn('base.button.block')"
        >
          <a-switch v-model:checked="activeData.block" />
        </a-form-item>
        <a-form-item
          v-if="activeData.__config__.buttonText !== undefined"
          v-show="'picture-card' !== activeData['list-type']"
          :label="tFn('base.button.text')"
        >
          <a-input
            v-model:value="activeData.__config__.buttonText"
            :placeholder="tFn('base.enter')"
          />
        </a-form-item>
        <a-form-item
          v-if="activeData.__config__.tag === 'a-button'"
          :label="tFn('base.button.text')"
        >
          <a-input
            v-model:value="activeData.__slot__.default"
            :placeholder="tFn('base.enter')"
          />
        </a-form-item>
        <a-form-item
          v-if="activeData.separator !== undefined"
          :label="tFn('base.separator')"
        >
          <a-input
            v-model:value="activeData.separator"
            :placeholder="tFn('base.separator')"
          />
        </a-form-item>
        <a-form-item
          v-if="activeData['show-time'] !== undefined"
          :label="tFn('base.time.choose')"
        >
          <a-switch v-model:checked="activeData['show-time']" />
        </a-form-item>
        <a-form-item
          v-if="activeData['show-today'] !== undefined"
          :label="tFn('base.show.today')"
        >
          <a-switch v-model:checked="activeData['show-today']" />
        </a-form-item>
        <a-form-item
          v-if="activeData['use12-hours'] !== undefined"
          :label="tFn('base.use12.hours')"
        >
          <a-switch v-model:checked="activeData['use12-hours']" />
        </a-form-item>
        <a-form-item
          v-if="activeData.format !== undefined"
          :label="tFn('base.time.format')"
        >
          <a-input
            :value="activeData.format"
            :placeholder="tFn('base.enter')"
            @input="setTimeValue($event)"
          />
        </a-form-item>
        <a-form-item
          v-if="activeData['enter-button'] !== undefined"
          :label="tFn('base.button.style')"
        >
          <a-switch v-model:checked="activeData['enter-button']" />
        </a-form-item>
        <a-form-item
          v-if="activeData.__config__.tag === 'a-auto-complete'"
          :label="tFn('base.datasource')"
        >
          <template v-for="tag in activeData.dataSource">
            <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
              <a-tag
                :key="tag"
                :closable="true"
                @close="() => handleAutoDataSourceClose(tag)"
              >
                {{ `${tag.slice(0, 20)}...` }}
              </a-tag>
            </a-tooltip>
            <a-tag
              v-else
              :key="tags"
              :closable="true"
              @close="() => handleAutoDataSourceClose(tag)"
            >
              {{ tag }}
            </a-tag>
          </template>
          <a-input
            v-if="inputAutoDataSourceVisible"
            ref="inputAutoDataSource"
            type="text"
            size="small"
            :style="{ width: '78px' }"
            :value="inputAutoDataSourceValue"
            @change="handleInputAutoDataSourceChange"
            @blur="handleInputAutoDataSourceConfirm"
            @keyup.enter="handleInputAutoDataSourceConfirm"
          />
          <a-tag
            v-else
            style="background: #fff; borderstyle: dashed"
            @click="showAutoDataSourceInput"
          >
            <a-icon type="plus" /> New
          </a-tag>
        </a-form-item>
        <a-form-item
          v-if="activeData.__config__.tag === 'a-auto-complete'"
          :label="tFn('base.filter.option')"
        >
          <a-switch v-model:checked="activeData['filter-option']" />
        </a-form-item>
        <a-form-item v-if="activeData.backfill !== undefined">
          <template slot="label">
            <a-tooltip>
              <template slot="title">
                {{ tFn("base.backfill.tip") }}
              </template>
              {{ tFn("base.backfill") }}
              <a-icon type="question-circle" />
            </a-tooltip>
          </template>
          <a-switch v-model:checked="activeData.backfill" />
        </a-form-item>
        <a-form-item
          v-if="activeData['default-open'] !== undefined"
          :label="tFn('base.default.open')"
        >
          <a-switch v-model:checked="activeData['default-open']" />
        </a-form-item>
        <a-form-item
          v-if="activeData.placement !== undefined"
          :label="tFn('base.placement')"
        >
          <a-radio-group v-model:value="activeData.placement" button-style="solid">
            <a-radio-button value="top"> top </a-radio-button>
            <a-radio-button value="bottom"> bottom </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-if="
            activeData.prefix !== undefined &&
            activeData.__config__.tag === 'a-mentions'
          "
          :label="tFn('base.trigger.keyword')"
        >
          <a-input
            v-model:value="activeData.prefix"
            :placeholder="tFn('base.enter')"
          />
        </a-form-item>
        <a-form-item
          v-if="activeData.split !== undefined"
          :label="tFn('base.separator')"
        >
          <a-input
            v-model:value="activeData.split"
            :placeholder="tFn('base.separator')"
          />
        </a-form-item>
        <template
          v-if="
            [
              'a-checkbox-group',
              'a-radio-group',
              'a-select',
              'a-mentions',
            ].indexOf(activeData.__config__.tag) > -1
          "
        >
          <a-divider>{{ tFn("base.option") }}</a-divider>
          <draggable
            :list="activeData.options"
            :animation="340"
            group="selectItem"
            handle=".option-drag"
          >
            <div
              v-for="(item, index) in activeData.options"
              :key="index"
              class="select-item"
            >
              <div class="select-line-icon option-drag">
                <a-icon type="pic-left" />
              </div>
              <a-input
                v-model:value="item.label"
                :placeholder="tFn('base.option.name')"
              />
              <a-input
                :placeholder="tFn('base.option.value')"
                :value="item.value"
                @input="setOptionValue(item, $event)"
              />
              <div
                class="close-btn select-line-icon"
                @click="activeData.options.splice(index, 1)"
              >
                <a-icon type="minus-circle" />
              </div>
            </div>
          </draggable>
          <div style="margin-left: 20px">
            <a-button
              style="padding-bottom: 0"
              icon="plus-circle"
              type="link"
              @click="addSelectItem"
            >
              {{ tFn("base.add.option") }}
            </a-button>
          </div>
          <a-divider />
        </template>
        <!-- 穿梭框数据源 -->
        <template v-if="activeData.__config__.tag === 'a-transfer'">
          <a-divider>{{ tFn("base.datasource") }}</a-divider>
          <draggable
            :list="activeData.dataSource"
            :animation="340"
            group="selectItem"
            handle=".option-drag"
          >
            <div
              v-for="(item, index) in activeData.dataSource"
              :key="item.key"
              class="select-item"
            >
              <div class="select-line-icon option-drag">
                <a-icon type="pic-left" />
              </div>
              <a-input
                v-model:value="item.title"
                :placeholder="tFn('base.show.name')"
              />
              <a-input
                :placeholder="tFn('base.data.value')"
                :value="item.key"
                @input="setDataSourceKey(item, $event)"
              />
              <div
                class="close-btn select-line-icon"
                @click="activeData['dataSource'].splice(index, 1)"
              >
                <a-icon type="minus-circle" />
              </div>
            </div>
          </draggable>
          <div style="margin-left: 20px">
            <a-button
              style="padding-bottom: 0"
              icon="plus-circle"
              type="link"
              @click="addDataSourceItem"
            >
              {{ tFn("base.add.data") }}
            </a-button>
          </div>
          <a-divider />
        </template>

        <template
          v-if="
            ['a-cascader', 'a-tree-select'].includes(activeData.__config__.tag)
          "
        >
          <a-divider>{{ tFn("base.option") }}</a-divider>
          <a-form-item
            v-if="activeData.__config__.dataType"
            :label="tFn('base.data.type')"
          >
            <a-radio-group
              v-model:value="activeData.__config__.dataType"
              size="small"
              button-style="solid"
            >
              <a-radio-button value="dynamic">
                {{ tFn("base.data.dynamic") }}
              </a-radio-button>
              <a-radio-button value="static">
                {{ tFn("base.data.static") }}
              </a-radio-button>
            </a-radio-group>
          </a-form-item>

          <template v-if="activeData.__config__.dataType === 'dynamic'">
            <a-form-item :label="tFn('base.url')">
              <a-input
                v-model:value="activeData.__config__.url"
                :title="activeData.__config__.url"
                :placeholder="tFn('base.enter')"
                allow-clear
                @blur="emit('fetch-data', activeData)"
              >
                <a-select
                  slot="prepend"
                  v-model:value="activeData.__config__.method"
                  :style="{ width: '85px' }"
                  @change="emit('fetch-data', activeData)"
                >
                  <a-select-option value="get"> get </a-select-option>
                  <a-select-option value="post"> post </a-select-option>
                  <a-select-option value="put"> put </a-select-option>
                  <a-select-option value="delete"> delete </a-select-option>
                </a-select>
              </a-input>
            </a-form-item>
            <a-form-item :label="tFn('base.data.path')">
              <a-input
                v-model:value="activeData.__config__.dataPath"
                :placeholder="tFn('base.enter')"
                @blur="emit('fetch-data', activeData)"
              />
            </a-form-item>

            <template v-if="activeData.props && activeData.props.props">
              <a-form-item :label="tFn('base.prop.label')">
                <a-input
                  v-model:value="activeData.props.props.label"
                  :placeholder="tFn('base.enter')"
                />
              </a-form-item>
              <a-form-item l:label="tFn('base.prop.value')">
                <a-input
                  v-model:value="activeData.props.props.value"
                  :placeholder="tFn('base.enter')"
                />
              </a-form-item>
              <a-form-item :label="tFn('base.prop.children')">
                <a-input
                  v-model:value="activeData.props.props.children"
                  :placeholder="tFn('base.enter')"
                />
              </a-form-item>
            </template>
          </template>

          <!-- 级联选择静态树 -->
          <!-- {{activeDataoptions}} -->
          <a-tree
            draggable
            :tree-data="
              activeData.__config__.tag === 'a-cascader'
                ? activeData.options
                : activeData['tree-data']
            "
            :replace-fields="{
              children: 'children',
              title: 'label',
              key: 'id',
            }"
          >
            <template #title="data">
              <a-dropdown :trigger="['contextmenu']">
                <span>{{ data.label }}</span>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="1" @click="append(data.dataRef)">
                      <a-icon type="plus" style="color: #1890ff" />
                      {{ tFn("base.add") }}
                    </a-menu-item>
                    <a-menu-item key="2" @click="remove(data)">
                      <a-icon
                        type="delete"
                        theme="twoTone"
                        two-tone-color="#eb2f96"
                      />
                      {{ tFn("base.remove") }}
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
          </a-tree>
          <div
            v-if="activeData.__config__.dataType === 'static'"
            style="margin-left: 20px"
          >
            <a-button
              style="padding-bottom: 0"
              icon="plus-circle"
              type="link"
              @click="
                addTreeItem(
                  activeData.__config__.tag === 'a-cascader'
                    ? 'options'
                    : 'tree-data'
                )
              "
            >
              {{ tFn("base.add.parent") }}
            </a-button>
          </div>
          <a-divider />
        </template>

        <a-form-item
          v-if="activeData.__config__.optionType !== undefined"
          :label="tFn('base.option.type')"
        >
          <a-radio-group
            v-model:value="activeData.__config__.optionType"
            button-style="solid"
          >
            <a-radio-button value="default">
              {{ tFn("base.default") }}
            </a-radio-button>
            <a-radio-button value="button">
              {{ tFn("base.button") }}
            </a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          v-if="activeData.__config__.showLabel !== undefined"
          :label="tFn('base.show.label')"
        >
          <a-switch v-model:checked="activeData.__config__.showLabel" />
        </a-form-item>
        <a-form-item
          v-if="activeData['allow-half'] !== undefined"
          :label="tFn('base.allow.half')"
        >
          <a-switch v-model:checked="activeData['allow-half']" />
        </a-form-item>
        <a-form-item
          v-if="activeData.__config__.tag === 'a-rate'"
          :label="tFn('base.character')"
        >
          <a-input v-model:value="activeData.character" @change="characterChange" />
        </a-form-item>
        <a-form-item
          v-if="activeData.reverse !== undefined"
          :label="tFn('base.reverse')"
        >
          <a-switch v-model:checked="activeData.reverse" />
        </a-form-item>
        <a-form-item
          v-if="activeData.range !== undefined"
          :label="tFn('base.range')"
        >
          <a-switch v-model:checked="activeData.range" @change="rangeChange" />
        </a-form-item>
        <a-form-item
          v-if="
            activeData.buttonStyle !== undefined &&
            activeData.__config__.optionType === 'button'
          "
          :label="tFn('base.button.style')"
        >
          <a-radio-group v-model:value="activeData.buttonStyle" button-style="solid">
            <a-radio-button value="outline">
              {{ tFn("base.button.style.outline") }}
            </a-radio-button>
            <a-radio-button value="solid">
              {{ tFn("base.button.style.solid") }}
            </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-if="activeData.size !== undefined"
          :label="tFn('base.component.size')"
        >
          <a-radio-group v-model:value="activeData.size" button-style="solid">
            <a-radio-button
              v-if="activeData.__config__.tag !== 'a-switch'"
              value="large"
            >
              {{ tFn("base.component.size.large") }}
            </a-radio-button>
            <a-radio-button value="default">
              {{ tFn("base.component.size.default") }}
            </a-radio-button>
            <a-radio-button value="small">
              {{ tFn("base.component.size.small") }}
            </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-if="activeData['show-word-limit'] !== undefined"
          :label="tFn('base.word.limit')"
        >
          <a-switch v-model:checked="activeData['show-word-limit']" />
        </a-form-item>
        <a-form-item
          v-if="activeData.__config__.tag === 'a-cascader'"
          :label="tFn('base.expand.trigger')"
        >
          <a-radio-group
            v-model:value="activeData['expand-trigger']"
            button-style="solid"
          >
            <a-radio-button value="click"> click </a-radio-button>
            <a-radio-button value="hover"> hover </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-if="activeData.__config__.tag === 'a-cascader'"
          :label="tFn('base.change.on.select')"
        >
          <a-switch v-model:checked="activeData['change-on-select']" />
        </a-form-item>
        <a-form-item
          v-if="activeData.allowClear !== undefined"
          :label="tFn('base.allow.clear')"
        >
          <a-switch v-model:checked="activeData.allowClear" />
        </a-form-item>
        <a-form-item
          v-if="activeData.__config__.tag === 'a-upload'"
          :label="tFn('base.file.multiple')"
        >
          <a-switch v-model:checked="activeData.multiple" />
        </a-form-item>
        <a-form-item
          v-if="activeData['input-read-only'] !== undefined"
          :label="tFn('base.read.only')"
        >
          <a-switch v-model:checked="activeData['input-read-only']" />
        </a-form-item>
        <a-form-item
          v-if="activeData.disabled !== undefined"
          :label="tFn('base.disabled')"
        >
          <a-switch v-model:checked="activeData.disabled" />
        </a-form-item>
        <a-form-item
          v-if="activeData.showSearch !== undefined"
          :label="tFn('base.show.search')"
        >
          <a-switch v-model:checked="activeData.showSearch" />
        </a-form-item>
        <a-form-item
          v-if="activeData.__config__.tag === 'a-select'"
          :label="tFn('base.mode')"
        >
          <a-radio-group v-model:value="activeData.mode" button-style="solid">
            <a-radio-button value="default">
              {{ tFn("base.default") }}
            </a-radio-button>
            <a-radio-button value="multiple">
              {{ tFn("base.multiple") }}
            </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-if="activeData.__config__.required !== undefined"
          :label="tFn('base.required')"
        >
          <a-switch v-model:checked="activeData.__config__.required" />
        </a-form-item>
        <a-form-item
          v-if="activeData.__config__.tag === 'a-tree-select'"
          :label="tFn('base.dropdown.matc.select.width')"
        >
          <a-switch v-model:checked="activeData['dropdown-matc-select-width']" />
        </a-form-item>
        <a-form-item
          v-if="activeData.__config__.tag === 'a-tree-select'"
          :label="tFn('base.tree.default.expand.all')"
        >
          <a-switch v-model:checked="activeData['tree-default-expand-all']" />
        </a-form-item>
        <a-form-item
          v-if="
            activeData.__config__.tag === 'a-tree-select' &&
            !activeData['tree-checkable']
          "
          :label="tFn('base.multiple')"
        >
          <a-switch v-model:checked="activeData.multiple" />
        </a-form-item>
        <a-form-item
          v-if="activeData.__config__.tag === 'a-tree-select'"
          :label="tFn('base.tree.checkable')"
        >
          <a-switch v-model:checked="activeData['tree-checkable']" />
        </a-form-item>
        <a-form-item
          v-if="
            activeData.__config__.tag === 'a-tree-select' &&
            activeData['tree-checkable']
          "
          :label="tFn('base.tree.check.strictly')"
        >
          <a-switch v-model:checked="activeData['tree-check-strictly']" />
        </a-form-item>
        <a-form-item
          v-if="
            activeData.__config__.tag === 'a-tree-select' &&
            !activeData['tree-check-strictly']
          "
          :label="tFn('base.label.in.value')"
        >
          <a-switch v-model:checked="activeData['label-in-value']" />
        </a-form-item>

        <template v-if="activeData.__config__.layoutTree">
          <a-divider>{{ tFn("base.layout.tree") }}</a-divider>
          <a-tree
            :tree-data="[activeData.__config__]"
            :replace-fields="{
              children: 'children',
              title: 'componentName',
              key: 'renderKey',
            }"
          >
            <template #title="data">
              <a-dropdown :trigger="['contextmenu']">
                <span>
                  {{
                    data.componentName ||
                    data.value.__config__.componentName ||
                    `${data.value.__config__.label} : ${data.__vModel__}`
                  }}
                </span>
              </a-dropdown>
            </template>
          </a-tree>
        </template>

        <template v-if="Array.isArray(activeData.__config__.regList)">
          <a-divider>{{ tFn("base.reg.list") }}</a-divider>
          <div
            v-for="(item, index) in activeData.__config__.regList"
            :key="index"
            class="reg-item"
          >
            <span
              class="close-btn"
              @click="activeData.__config__.regList.splice(index, 1)"
            >
              <a-icon
                :style="{ fontSize: '16px' }"
                type="close-circle"
                theme="twoTone"
                two-tone-color="#ff4d4f"
              />
            </span>
            <a-form-item :label="tFn('base.pattern')">
              <a-auto-complete
                v-model:value="item.pattern"
                :dataSource="patternSource"
                :placeholder="tFn('base.enter.pattern')"
                option-label-prop="value"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              :label="tFn('base.error.message')"
              style="margin-bottom: 0"
            >
              <a-input
                v-model:value="item.message"
                :placeholder="tFn('base.enter')"
              />
            </a-form-item>
          </div>
          <a-button icon="plus-circle" type="link" @click="addReg">
            {{ tFn("base.add.reg") }}
          </a-button>
        </template>
      </a-form>
      <!-- 表单属性 -->
      <a-form
      :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        v-show="currentTab === 'form'"
        size="small"
        label-width="90px"
      >
        <a-form-item :label="tFn('base.form.name')">
          <a-input
            v-model:value="formConf.formRef"
            :placeholder="`${tFn('base.enter')}${tFn('base.form.name')}(ref)`"
          />
        </a-form-item>
        <a-form-item :label="tFn('base.form.model')">
          <a-input
            v-model:value="formConf.formModel"
            :placeholder="tFn('base.enter')"
          />
        </a-form-item>
        <a-form-item :label="tFn('base.form.rules')">
          <a-input
            v-model:value="formConf.formRules"
            :placeholder="tFn('base.enter')"
          />
        </a-form-item>
        <a-form-item :label="tFn('base.form.layout')">
          <a-radio-group v-model:value="formConf.layout" button-style="solid">
            <a-radio-button value="horizontal">
              {{ tFn("base.form.layout.horizontal") }}
            </a-radio-button>
            <a-radio-button value="vertical">
              {{ tFn("base.form.layout.vertical") }}
            </a-radio-button>
            <a-radio-button value="inline">
              <a-tooltip>
                <template slot="title">
                  {{ tFn("base.form.layout.inline.tip") }}
                </template>
                {{ tFn("base.form.layout.inline") }}
                <a-icon type="exclamation-circle" />
              </a-tooltip>
            </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-if="formConf.layout === 'horizontal'"
          :label="tFn('base.form.label.span')"
        >
          <a-input v-model:value="formConf.labelCol.span" />
        </a-form-item>
        <a-form-item
          v-if="formConf.layout === 'horizontal'"
          :label="tFn('base.form.label.offset')"
        >
          <a-input v-model:value="formConf.labelCol.offset" />
        </a-form-item>
        <a-form-item
          v-if="formConf.layout === 'horizontal'"
          :label="tFn('base.form.wrapper.span')"
        >
          <a-input v-model:value="formConf.wrapperCol.span" />
        </a-form-item>
        <a-form-item
          v-if="formConf.layout === 'horizontal'"
          :label="tFn('base.form.wrapper.offset')"
        >
          <a-input v-model:value="formConf.wrapperCol.offset" />
        </a-form-item>
        <a-form-item :label="tFn('base.label.align')">
          <a-radio-group v-model:value="formConf.labelAlign" button-style="solid">
            <a-radio-button value="left">
              {{ tFn("base.label.align.left") }}
            </a-radio-button>
            <a-radio-button value="right">
              {{ tFn("base.label.align.right") }}
            </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item :label="tFn('base.grid.space')">
          <a-input-number v-model:value="formConf.gutter" :min="0" />
        </a-form-item>
        <a-form-item :label="tFn('base.form.disabled')">
          <a-switch v-model:checked="formConf.disabled" />
        </a-form-item>
        <a-form-item :label="tFn('base.form.button')">
          <a-switch v-model:checked="formConf.formBtns" />
        </a-form-item>
        <a-form-item :label="tFn('base.un.focused.component.border')">
          <a-switch v-model:checked="formConf.unFocusedComponentBorder" />
        </a-form-item>
      </a-form>
    </div>
    <!-- field-box -->
    <div>
      <a-tooltip>
        <template slot="title">
          {{ tFn("base.component.doc") }}
        </template>
        <a
          class="document-link"
          target="_blank"
          :href="documentLink"
          :title="tFn('base.component.doc')"
        >
          <link-outlined />
        </a>
      </a-tooltip>
    </div>

    <treeNode-modal
      ref="treeNodeModal"
      :title="tFn('base.add.option')"
      @commit="addNode"
    />
  </div>
</template>

<script>
import allIcon from "@/core/icons";
import { isArray } from "util";
import TreeNodeModal from "@/views/index/TreeNodeModal";
import { isNumberStr, setObject } from "@/utils/index";
import {
  inputComponents,
  selectComponents,
} from "@/components/generator/config";
import { FORM_CONF,ACTIVE_DATA } from "@/store/mutation-types";
import { LinkOutlined } from "@ant-design/icons-vue";
import {
  defineComponent,
  computed,
  ref,
  watch,
  reactive,
  onMounted,
} from "vue";
import { tFn } from "@/hook/useI18n";
import { useStore } from "vuex";

// 使changeRenderKey在目标组件改变时可用
const needRerenderList = [];

export default defineComponent({
  components: {
    TreeNodeModal,
    LinkOutlined,
  },
  props: {
    showField: String,
    activeData: Object,
    formConf: Object,
    currentIndex:Number
  },
  emits: ["tag-change",'from-change'],
  setup(props, { emit }) {
    const store = useStore();
    const currentTab = ref("field");
    const formConf = ref({ ...props.formConf });
    const showField = ref(props.showField);
    const treeNodeModal = ref();
    const justifyOptions = ref([
      {
        label: "start",
        value: "start",
      },
      {
        label: "end",
        value: "end",
      },
      {
        label: "center",
        value: "center",
      },
      {
        label: "space-around",
        value: "space-around",
      },
      {
        label: "space-between",
        value: "space-between",
      },
    ]);
    const activeData = reactive({
      ...props.activeData,
    });
    const idGlobal = ref(0);
    const currentNode = ref([]);
    const iconsVisible = ref(false);
    const currentIconModelSlot = ref(null);
    const currentIconModel = ref(null);
    const inputAutoDataSourceVisible = ref(false);
    const inputAutoDataSourceValue = ref("");

    // 定义 computed
    const documentLink = computed(() => {
      return activeData.__config__.document || "tag.document";
    });
    const tagList = computed(() => {
      return [
        {
          label: "base.input_components",
          options: inputComponents,
        },
        {
          label: "base.optional_components",
          options: selectComponents,
        },
      ];
    });
    const patternSource = computed(() => {
      return [
        {
          text: tFn("base.number"),
          value: "/^[0-9]*$/",
        },
        {
          text: tFn("base.letter"),
          value: "/^[A-Za-z]+$/",
        },
        {
          text: tFn("base.letter.number"),
          value: "^[A-Za-z0-9]+$",
        },
        {
          text: tFn("base.letter.number.underliner"),
          value: "/^\\w+$/",
        },
        {
          text: tFn("base.chinese.characters"),
          value: "/^[\u4e00-\u9fa5],{0,}$/",
        },
        {
          text: tFn("base.mail"),
          value:
            "/^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$/",
        },
        {
          text: "URL",
          value:
            "/^http://([\\w-]+\\.)+[\\w-]+(/[\\w-./?%&=]*)?$ ；^[a-zA-z]+://(w+(-w+)*)(.(w+(-w+)*))*(?S*)?$/",
        },
      ];
    });
    const activeTag = computed(() => {
      return activeData.__config__.tag;
    });
    const isShowMin = computed(() => {
      return ["a-input-number", "a-slider"].indexOf(activeTag.value) > -1;
    });
    const isShowMax = computed(() => {
      return ["a-input-number", "a-slider"].indexOf(activeTag.value) > -1;
    });
    const isShowStep = computed(() => {
      return ["a-input-number", "a-slider"].indexOf(activeTag.value) > -1;
    });
    function addReg() {
      activeData.__config__.regList.push({
        pattern: "",
        message: "",
      });
    }

    function addSelectItem() {
      activeDataoptions.push({
        label: "",
        value: "",
      });
    }

    function addDataSourceItem() {
      activeDatadataSource.push({
        titel: "",
        key: "",
      });
    }

    function addTreeItem(keyName) {
      ++idGlobal.value;
      treeNodeModal.value.open();
      currentNode.value = activeData[keyName];
    }

    function remove(node) {
      activeData.__config__.defaultValue = []; // 避免删除时报错
      const { pos } = node;
      const dataPos = pos.split("-");
      treeRemove(activeDataoptions, 1, dataPos);
    }

    function treeRemove(node, index, dataPos) {
      const i = index + 1;
      if (index < dataPos.length - 1) {
        treeRemove(node[Number(dataPos[index])].children, i, dataPos);
      } else {
        node.splice(Number(dataPos[index]), 1);
      }
    }

    function addNode(data) {
      currentNode.value.push(data);
    }

    function setOptionValue(item, event) {
      const val = event.target.value;
      item.value = isNumberStr(val) ? +val : val;
    }

    function setDataSourceKey(item, event) {
      const val = event.target.value;
      item.key = isNumberStr(val) ? +val : val;
    }

    function changeStartPlaceholder(val) {
      activeDataplaceholder[0] = val.target._value;
    }

    function changeEndPlaceholder(val) {
      activeDataplaceholder[1] = val.target._value;
    }

    function setDefaultValue(val) {
      if (Array.isArray(val)) {
        return val.join(",");
      }
      if (["string", "number"].indexOf(typeof val) > -1) {
        return val;
      }
      if (typeof val === "boolean") {
        return `${val}`;
      }
      return val;
    }

    function onDefaultValueInput(event) {
      const str = event.target.value;
      if (isArray(activeData.__config__.defaultValue)) {
        // 数组
        activeData.__config__.defaultValue = str
          .split(",")
          .map((val) => (isNumberStr(val) ? +val : val));
      } else if (["true", "false"].indexOf(str) > -1) {
        // 布尔
        activeData.__config__.defaultValue = JSON.parse(str);
      } else {
        // 字符串和数字
        activeData.__config__.defaultValue = isNumberStr(str) ? +str : str;
      }
    }

    function onSwitchValueInput(val, name) {
      if (["true", "false"].indexOf(val) > -1) {
        activeData[name] = JSON.parse(val);
      } else {
        activeData[name] = isNumberStr(val) ? +val : val;
      }
    }

    function setTimeValue(event) {
      activeData.__config__.defaultValue = null;
      activeData["value-format"] = event.target.value;
      activeDataformat = event.target.value;
    }

    function spanChange(val) {
      formConf.span = val;
    }

    function multipleChange(val) {
      activeData.__config__.defaultValue = val ? [] : "";
    }

    function rangeChange(val) {
      activeData.__config__.defaultValue = val
        ? [activeDatamin, activeDatamax]
        : activeDatamin;
    }


    function tagChange(tagIcon) {
      let target = inputComponents.find(
        (item) => item.__config__.tagIcon === tagIcon
      );
      if (!target)
        target = selectComponents.find(
          (item) => item.__config__.tagIcon === tagIcon
        );
      emit("tag-change", target);
    }

    function changeRenderKey() {
      if (needRerenderList.includes(activeData.__config__.tag)) {
        activeData.__config__.renderKey = +new Date();
      }
    }

    function characterChange(e) {
      if (!e.target.value || e.target.value === "") {
        activeDatacharacter = undefined;
      }
    }

    function handleIconChange(icon) {
      iconsVisible.value = false;
      if (currentIconModelSlot) {
        activeData__slot__[currentIconModel] = icon;
      } else {
        activeData[currentIconModel] = icon;
      }
    }
    // 自动完成数据源
    function handleAutoDataSourceClose(removedTag) {
      const dataSource = activeData["dataSource"].filter(
        (tag) => tag !== removedTag
      );
      activeData["dataSource"] = dataSource;
    }

    function showAutoDataSourceInput() {
      inputAutoDataSourceVisible.value = true;
      setTimeout(() => {
        const input = document.getElementById("inputAutoDataSource");
        input.focus();
      }, 0);
    }

    function handleInputAutoDataSourceChange(e) {
      inputAutoDataSourceValue.value = e.target.value;
    }

    function handleInputAutoDataSourceConfirm() {
      const { inputAutoDataSourceValue } = this;
      let dataSource = activeData["dataSource"];
      if (
        inputAutoDataSourceValue &&
        dataSource.indexOf(inputAutoDataSourceValue) === -1
      ) {
        dataSource = [...dataSource, inputAutoDataSourceValue];
      }
      activeData["dataSource"] = dataSource;
      inputAutoDataSourceVisible.value = false;
      inputAutoDataSourceValue.value = "";
    }
    function append(data) {
      if (!data.children) {
        data.children = [];
      }
      treeNodeModal.value.open();
      currentNode.value = data.children;
    }

    // 监听表单配置数据变化
    watch(
      formConf,
      (val) => {
        store.commit(FORM_CONF, val);
      },
      { deep: true }
    );

    watch(
      props.activeData,
      (val) => {
        setObject(val, activeData);
      },
      { deep: true }
    );


    watch(
      activeData,
      (val) => {
        emit('from-change',val)
      },
      { deep: true }
    );

    return {
      allIcon,
      currentTab,
      currentNode,
      iconsVisible,
      currentIconModelSlot,
      currentIconModel,
      justifyOptions,
      inputAutoDataSourceVisible,
      inputAutoDataSourceValue,
      activeData,
      documentLink,
      tagList,
      patternSource,
      activeTag,
      isShowMin,
      isShowMax,
      isShowStep,
      formConf,
      idGlobal,
      currentNode,
      addReg,
      addSelectItem,
      addDataSourceItem,
      addTreeItem,
      append,
      remove,
      treeRemove,
      addNode,
      setOptionValue,
      setDataSourceKey,
      changeStartPlaceholder,
      changeEndPlaceholder,
      setDefaultValue,
      onDefaultValueInput,
      onSwitchValueInput,
      setTimeValue,
      spanChange,
      multipleChange,
      rangeChange,
      tagChange,
      changeRenderKey,
      characterChange,
      handleIconChange,
      handleAutoDataSourceClose,
      showAutoDataSourceInput,
      handleInputAutoDataSourceChange,
      handleInputAutoDataSourceConfirm,
      emit
    };
  },
});
</script>

<style lang="scss" scoped>
.ant-form-item {
  margin-bottom: 10px;
}

.right-header {
  background: #fff;
  padding: 15px;
  margin-top: 20px;
  padding-bottom: 0;
}

.right-main {
  height: calc(100vh - 64px - 30px);
  overflow-y: auto;
  margin: 10px 10px 0;
  padding: 5px;
}

.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;

  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }

  & .a-input + .a-input {
    margin-left: 4px;
  }
}

.select-item + .select-item {
  margin-top: 4px;
}

.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}

.select-line-icon {
  line-height: 32px;
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}

.option-drag {
  cursor: move;
}

.time-range {
  .el-date-editor {
    width: 227px;
  }

  ::v-deep .el-icon-time {
    display: none;
  }
}

.document-link {
  position: absolute;
  display: block;
  width: 26px;
  height: 26px;
  top: 0;
  left: 0;
  cursor: pointer;
  background: #409eff;
  z-index: 1;
  border-radius: 0 0 6px 0;
  text-align: center;
  line-height: 26px;
  color: #fff;
  font-size: 18px;
}
</style>
