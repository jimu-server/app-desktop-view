<template>
  <div>
    <NodeResizer  min-width="30" min-height="30" @resize="resize"/>
    <Handle type="target" :position="Position.Left"/>
    <Handle type="target" :position="Position.Right"/>
    <Handle type="target" :position="Position.Top"/>
    <Handle type="target" :position="Position.Bottom"/>
    <slot></slot>
  </div>
</template>
<script setup lang="ts">

import {Handle, Position, useHandleConnections, useNodesData} from '@vue-flow/core'
import useDragAndDrop from "@/components/system-components/tool/flowTool/store/flowDragAndDrop";
import {NodeResizer} from '@vue-flow/node-resizer'
import {ref} from "vue";

const connections = useHandleConnections({
  type: 'target',
})
const nodesData = useNodesData(() => connections.value[0]?.source)
const {onDragStart} = useDragAndDrop()

const emits = defineEmits({
  resize: (width: number, height: number) => {

  }
})

const isClicked = ref(false)

function resize({params}) {
  emits('resize', params.width, params.height)
}

function click() {
  isClicked.value = true
}
</script>


<style scoped>

.diamond {

}
</style>
