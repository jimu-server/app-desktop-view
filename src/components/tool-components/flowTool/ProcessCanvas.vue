<template>
  <!-- 流程图画布 -->
  <div class="fit" ref="flow" id="container" @mousedown.right="panning"></div>
</template>
<script setup lang="ts">
import {markRaw, onMounted, ref} from "vue";
import {Graph} from "@antv/x6";
import {register} from "@antv/x6-vue-shape";
import DescriptionNode from "@/components/tool-components/flowTool/node/DescriptionNode.vue";
import {Selection} from '@antv/x6-plugin-selection'
import {History} from '@antv/x6-plugin-history'
import {Dnd} from "@antv/x6-plugin-dnd";
import {Snapline} from "@antv/x6-plugin-snapline";
import {Scroller} from "@antv/x6-plugin-scroller";

const flow = ref()

register({
  shape: 'custom-vue-node',
  width: 100,
  height: 100,
  component: DescriptionNode,
})

const data = {
  nodes: [
    {
      id: 'node1',
      shape: 'rect',
      x: 40,
      y: 40,
      width: 100,
      height: 100,
      label: 'hello',
      attrs: {
        // body 是选择器名称，选中的是 rect 元素
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    },
    {
      id: 'node2',
      shape: 'rect',
      x: 160,
      y: 180,
      width: 100,
      height: 40,
      label: 'world',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    },
  ],
  edges: [
    {
      shape: 'edge',
      source: 'node1',
      target: 'node2',
      label: 'x6',
      attrs: {
        // line 是选择器名称，选中的边的 path 元素
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    },
  ],
}

const graph = ref<Graph>()

function panning() {

}

onMounted(() => {

  graph.value = new Graph({
    container: flow.value,
    autoResize: true,
    panning: true,
    mousewheel: {
      enabled: true,
      modifiers: 'Ctrl',
      maxScale: 4,
      minScale: 0.2,
    },
    grid: {
      visible: true,
      type: 'doubleMesh',
      args: [
        {
          color: '#eee', // 主网格线颜色
          thickness: 1, // 主网格线宽度
        },
        {
          color: '#ddd', // 次网格线颜色
          thickness: 1, // 次网格线宽度
          factor: 1, // 主次网格线间隔
        },
      ],
    },
  })

  graph.value.use(
      new Selection({
        enabled: true,
        multiple: true,
        rubberband: true,
        movable: true,
        showNodeSelectionBox: true,
      }),
  )
  graph.value.use(
      new History({
        enabled: true,
      }),
  )

  const dnd = new Dnd({
    target: graph.value,
  })

  graph.value.use(
      new Snapline({
        enabled: true,
      }),
  )
  graph.value.use(
      new Scroller({
        enabled: true,
      }),
  )
  // graph.fromJSON(data) // 渲染元素


  graph.value.addNode({
    shape: 'custom-vue-node',
    x: 40,
    y: 40,
    width: 100,
    height: 40,
  });
  graph.value.addNode({
    shape: 'custom-vue-node',
    x: 45,
    y: 40,
    width: 100,
    height: 40,
  });
  graph.value.centerContent() // 居中显示
})

</script>
<style scoped>

</style>

