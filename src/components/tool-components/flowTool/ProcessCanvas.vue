<template>
  <!-- 流程图画布 -->
  <div
      class="fit"
      style="overflow: hidden"
      @drop="onDrop"
  >
    <VueFlow
        :nodes="nodes"
        :edges="edges"
        :node-types="nodeType"
        @dragover="onDragOver" @dragleave="onDragLeave"
        class="interactionflow fit"
        fit-view-on-init
        @keydown="onKeydown"
        @keyup="onKeyup"
    >
      <template #node-rectangle="props">
        <RectangleNode v-bind="props"/>
      </template>
      <InteractionControls/>
    </VueFlow>
  </div>
</template>
<script setup lang="ts">

import {useVueFlow, VueFlow} from "@vue-flow/core";
import {markRaw, ref} from "vue";
import useDragAndDrop from "@/components/tool-components/flowTool/store/flowDragAndDrop";
import RectangleNode from "@/components/tool-components/flowTool/node/RectangleNode.vue";

const {onDragOver, onDrop, onDragLeave, isDragOver} = useDragAndDrop()


const {
  nodesDraggable,
  nodesConnectable,
  elementsSelectable,
  zoomOnScroll,
  zoomOnDoubleClick,
  zoomOnPinch,
  panOnScroll,
  panOnScrollMode,
  panOnDrag,
  onConnect,
  onNodeDragStop,
  onPaneClick,
  onPaneScroll,
  onPaneContextMenu,
  onNodeDragStart,
  onMoveEnd,
  addEdges,
} = useVueFlow()

const nodeType = {
  rectangle: markRaw(RectangleNode)
}

const nodes = ref([
  {
    id: '1',
    label: 'Node 1',
    // this will create the node-type `custom`
    type: 'rectangle',
    position: {x: 50, y: 50},
  }
])

function onKeydown(e: KeyboardEvent) {
  console.log(e.key)
  if (e.ctrlKey) {
    panOnScroll.value = true
  }
}

function onKeyup(e: KeyboardEvent) {
  console.log(e.key)
  if (!e.ctrlKey) {
    panOnScroll.value = false
  }
}

const edges = ref([])

</script>
<style scoped>

</style>

