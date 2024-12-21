<template>
  <div class="container">
    <!-- <div class="logo"> <img src="../assets/logo.jpg" alt="rote" /></div> -->

    <div id="sun-3d"></div>

    <a-spin class="spin" :spinning="spinning" tip="数据加载中.."> </a-spin>

    <div class="tools">
      <div class="item" @click="geneRageModel">生成模型</div>
    </div>
  </div>
</template>
    
    
    <script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { Application } from "../iSolarRoof3dViewer/Application";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

//@ts-ignore
import request from "../utils/request";
import { message } from "ant-design-vue";
import { getStyle } from "./format/Format";

// const store = useStore();
const router = useRouter();
const roofId = router.currentRoute.value.params.id;

const spinning = ref(false);

let app: Application | null = null;

const geneRageModel = () => {
  console.log(window["_data_"]);

  if (!window["_data_"]) return;

  const { roof, points, area } = window["_data_"];

  console.log(window._data_);
  if (!app) return;
  app.viewer.engine.renderRoof(roof);
};

onMounted(async () => {
  spinning.value = true;
  app = new Application({
    domElement: document.getElementById("sun-3d"),
  });

  spinning.value = false; // app.viewer.engine.add3DStyle(style)

  window.addEventListener(
    "resize",
    () => {
      app?.viewer.engine.resize();
    },
    false
  );
});

onUnmounted(() => {
  app && app.viewer.engine.dispose();
});
</script>
    <style scoped lang="scss">
.container {
  width: 50vw;
  height: 100%;
  position: relative;
  box-sizing: border-box;
}

.spin {
  position: absolute;
  top: 50%;
  left: 50%;
}

#sun-3d {
  width: 100%;
  height: 100vh;
}

.tools {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;

  .item {
    width: 100px;
    border: 1px solid #000;
    margin-right: 20px;
    display: flex;
    justify-content: center;
    cursor: pointer;
    background: #fff;
  }
}
</style>
    
    