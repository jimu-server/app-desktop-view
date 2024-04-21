<script setup lang="ts">

import RectangleNode from "@/components/tool-components/flowTool/node/RectangleNode.vue";
import useDragAndDrop from "@/components/tool-components/flowTool/store/flowDragAndDrop";
import {Handle, Position} from "@vue-flow/core";

const {onDragStart} = useDragAndDrop()
const {onDragOver, onDrop, onDragLeave, isDragOver} = useDragAndDrop()
</script>

<template>
  <!--  元素列表       -->
  <q-list>
    <q-expansion-item
        expand-separator
        expand-icon="jimu-xiangxia-2"
        label="基础图形"

    >
      <div class="nodes">
        <div class="node" :draggable="true" @dragstart="onDragStart($event, 'rectangle')">rectangle
        </div>
      </div>
    </q-expansion-item>
  </q-list>
</template>

<style scoped>
.node {
  height: 50px;
  width: 100px;
  border: 1px solid #000000;
}
</style>