<template>
  <div class="view-conainer">
    <ViewComponent2d></ViewComponent2d>
    <ViewRefComponent3d></ViewRefComponent3d>
  </div>
</template>
  
  
  <script setup lang="ts">
import { ref, onMounted } from "vue";
//@ts-ignore
import ViewerOldComponent from "./viewer-old.vue";
//@ts-ignore
import ViewRefComponent3d from "./index-ref.vue";
import ViewComponent2d from "./2d/ViewComponent2d.vue";

import { useRouter } from "vue-router";

//@ts-ignore
import request from "../utils/request";
import { message } from "ant-design-vue";

const router = useRouter();
const roofId = router.currentRoute.value.params.id;

const refCom = ref();

const getRoof = async () => {
  const roofData = await request("/3D/roof/" + roofId);

  if (!roofData || roofData.code !== 200) {
    message.error("获取屋顶数据失败");
    return;
  }
  return roofData.data;
};

onMounted(async () => {});
</script>
  <style scoped>
.view-conainer {
  display: flex;
  height: 100%;
}
</style>
  
  