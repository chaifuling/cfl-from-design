<script>
import draggable from "vuedraggable";
import render from "@/components/render/render";
import { CopyOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { createVNode, reactive, defineComponent } from "vue";

const components = {
  itemBtns(h, currentItem, index, list, showIcon, disabled) {
    const { onCopyItem, onDeleteItem } = this.$attrs;
    return [
      <span
        style={{ display: showIcon ? "block" : "none" }}
        class="drawing-item-copy"
        title={this.tFn("base.copy")}
        onClick={(event) => {
          onCopyItem(currentItem, list);
          event.stopPropagation();
        }}
      >
        <CopyOutlined type="copy" />
      </span>,
      <span
        style={{ display: showIcon ? "block" : "none" }}
        class="drawing-item-delete"
        title={this.tFn("base.remove")}
        onClick={(event) => {
          onDeleteItem(index, list);
          event.stopPropagation();
        }}
      >
        <DeleteOutlined type="delete" />
      </span>,
    ];
  },
};
const layouts = {
  colFormItem(h, currentItem, index, list, showIcon, disabled) {
    const { onActiveItem, onFromChange } = this.$attrs;
    currentItem = reactive(currentItem);
    const config = reactive(currentItem.__config__);
    const child = renderChildren.apply(this, arguments);
    // 穿梭框特殊处理
    if (config.tag === "a-transfer") {
      currentItem.render = (item) => {
        return createVNode(
          "div",
          { key: item.title, value: item.key },
          item.title
        );
      };
    }
    let className =
      this.activeId === config.formId
        ? "drawing-item active-from-item"
        : "drawing-item";
    if (this.formConf.unFocusedComponentBorder)
      className += " unfocus-bordered";
    return (
      <a-col
        span={config.span}
        class={className}
        onClick={(event) => {
          if (onActiveItem) {
            onActiveItem(currentItem);
          }
          event.stopPropagation();
        }}
      >
        <a-form-item
          label={config.showLabel ? config.label : ""}
          required={config.required}
        >
          <render
            disabled={disabled}
            key={config.renderKey}
            conf={currentItem}
            onInput={(event) => {
              let value = event;
              if (
                config.tag === "a-input" ||
                config.tag === "a-textarea" ||
                config.tag === "a-input-password" ||
                config.tag === "a-input-search" ||
                config.tag === "a-radio-group"
              ) {
                value = event.target.value;
              }
              config.defaultValue = value;
              currentItem.__config__ = config;
              onFromChange(index, currentItem);
              // 穿梭框特殊处理
              if (config.tag === "a-transfer") {
                currentItem["target-keys"] = value;
              }
            }}
          >
            {child}
          </render>
        </a-form-item>
        {components.itemBtns.apply(this, arguments)}
      </a-col>
    );
  },
  rowFormItem(h, currentItem, index, list) {
    const { onActiveItem } = this.$attrs;
    const config = currentItem.__config__;
    const className =
      this.activeId === config.formId
        ? "drawing-row-item active-from-item"
        : "drawing-row-item";
    let child = renderChildren.apply(this, arguments);
    if (currentItem.type === "flex") {
      child = (
        <a-row
          type={currentItem.type}
          justify={currentItem.justify}
          align={currentItem.align}
        >
          {child}
        </a-row>
      );
    }
    return (
      <a-col span={config.span}>
        <a-row
          gutter={config.gutter}
          class={className}
          onClick={(event) => {
            onActiveItem(currentItem);
            event.stopPropagation();
          }}
        >
          <span class="component-name">{config.componentName}</span>
          <draggable
            list={config.children || []}
            animation={340}
            group="componentsGroup"
            class="drag-wrapper"
          >
            {{
              item: () => ({ child }),
            }}
          </draggable>
          {components.itemBtns.apply(this, arguments)}
        </a-row>
      </a-col>
    );
  },
  raw(h, currentItem, index, list) {
    const config = currentItem.__config__;
    const child = renderChildren.apply(this, arguments);
    return (
      <render
        key={config.renderKey}
        conf={currentItem}
        onInput={(event) => {
          this.$set(config, "defaultValue", event);
        }}
      >
        {child}
      </render>
    );
  },
};

function renderChildren(h, currentItem, index, list) {
  const config = currentItem.__config__;
  if (!Array.isArray(config.children)) return null;
  return config.children.map((el, i) => {
    const layout = layouts[el.__config__.layout];
    if (layout) {
      return layout.call(this, h, el, i, config.children);
    }
    return layoutIsNotFound.call(this);
  });
}

function layoutIsNotFound() {
  throw new Error(
    `${this.currentItem.__config__.layout}${this.tFn(
      "base.layout.format.failed"
    )}`
  );
}

export default defineComponent({
  components: {
    render,
    draggable,
  },
  props: [
    "currentItem",
    "index",
    "drawingList",
    "activeId",
    "formConf",
    "showIcon",
    "disabled",
  ],
  render() {
    const layout = layouts[this.currentItem.__config__.layout];
    const disabled = this.disabled || false;
    if (layout) {
      return layout.call(
        this,
        createVNode,
        this.currentItem,
        this.index,
        this.drawingList,
        this.showIcon,
        disabled
      );
    }
    return layoutIsNotFound.call(this);
  },
});
</script>
