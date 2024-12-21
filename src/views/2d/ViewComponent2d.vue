<template>
  <div id="container-2d"></div>

  <div class="tools">
    <div class="item" @click="onDrawPoint">绘制点</div>

    <div class="item" @click="onDrawLine">绘制线</div>

    <div class="item" @click="generageArea">生成面</div>
  </div>
</template>
    
    
    <script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

import { useStore } from "vuex";
import { useRouter } from "vue-router";

import { RenderPoints } from "./render/RenderPoints";
import { RenderLines } from "./render/RenderLines";
import Konva from "konva";
import { Graph } from "./render/Graph";
import { convexHull, filterArea, getMaxArea } from "./tools/ToArea";
import { renderArea } from "./tools/RenderArea";

// const store = useStore();
const router = useRouter();
let renderPoints: RenderPoints;
let renderLines: RenderLines;

let layer: Konva.Layer;
onMounted(() => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const stage = new Konva.Stage({
    container: "container-2d",
    width: width / 2,
    height: height,
  });

  const _layer = new Konva.Layer();

  layer = _layer;
  renderPoints = new RenderPoints(stage, _layer);

  renderLines = new RenderLines(stage, _layer);

  stage.add(_layer);

  _layer.draw();
});

const onDrawPoint = () => {
  if (renderLines) {
    renderLines.enabled = false;
  }
  if (renderPoints) {
    renderPoints.enabled = !renderPoints.enabled;
  }
};

const onDrawLine = () => {
  if (renderPoints) {
    renderPoints.enabled = false;
  }

  if (renderLines) {
    renderLines.enabled = !renderLines.enabled;
  }
};

const generageArea = () => {
  if (!renderLines || !renderPoints) return;

  const points: any = renderPoints.data;

  const allData = renderLines.allData;

  console.log(points, allData);

  let graph = new Graph();

  points.forEach((item: any) => {
    graph.addNode(item.pid);
  });

  let lines: any = [];
  allData.forEach((item: any) => {
    graph.addEdge(item[0].pid, item[1].pid);
    lines.push({
      id: Math.random().toString(36).substring(2, 9),
      points: [item[0].pid, item[1].pid],
    });
  });

  let cycles = graph.getAllSimpleCycles();

  const result = graph.removeDuplicateArrays(cycles); // let area = result.filter((item: any) => item.length == 3);

  let trangleList = filterArea(result, points, allData);

  console.log("三角面", trangleList);
  console.log("顶点数据", points); // const border: any = points.map((item: any) => item.point); // 示例：使用一组点计算凸包 // import { convex } from "@turf/convex"; // 使用truf库

  const hull = getMaxArea(result, points);

  console.log("Convex Hull:", hull);

  let group = new Konva.Group();

  layer.add(group);
  renderArea(points, trangleList, group); // let line = new Konva.Line({ // points: hull.flat().map((item: any) => points.find((a: any) => a.pid == item).point).flat(), // fill: "#ffddee", // stroke: "#f00", // closed: true, // }); // group.add(line);

  points.forEach((pt: any) => {
    pt.point.push(201);
    pt.point.forEach((item: any, index: number) => {
      pt.point[index] = item / 1000;
    });
  });

  let areas: any = [];

  trangleList.forEach((item: any) => {
    areas.push({
      pid: Math.random().toString(36).substring(2, 9),
      points: item,
    });
  });
  const twoDData = {
    areas: areas,
    points,
    lines,
    roof: hull,
  };

  console.log(twoDData);
  window["_data_"] = twoDData;
  layer.batchDraw();
};
</script>
    <style scoped lang="scss">
.container {
  background: #eee;
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
  }
}
</style>
    