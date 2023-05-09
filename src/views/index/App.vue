<template>
  <a-config-provider :locale="locale">
    <div>
      <router-view />
    </div>
  </a-config-provider>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import { useStore } from "vuex";
export default defineComponent({
  name: "apps",
  setup() {
    const store = useStore();
    const locale = ref(store.state.lang);
    onMounted(() => {
      // 取消开始的loading动画
      const preLoader = document.querySelector("#pre-loader");
      if (preLoader) {
        (preLoader as HTMLElement).style.display = "none";
      }

      // fix: firefox 下 拖拽 会新打卡一个选项卡
      // https://github.com/JakHuang/JDGT/issues/15
      document.body.ondrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
      };
    });

    return {
      locale
    }
  },
});
</script>
