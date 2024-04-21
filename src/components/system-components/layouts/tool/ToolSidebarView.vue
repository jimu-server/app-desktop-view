<template>
  <div class="fit column" style="flex: 1;overflow: hidden">
    <div class="full-width ellipsis" style="padding: 5px;overflow: hidden">
      {{ toolCtx.name }}
    </div>
    <div class="full-width" style="flex-grow: 1;overflow: auto">
      <component :is="toolCtx.component" :btn="toolCtx"/>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useToolStore} from "@/store/tool";
import {Tool} from "@/model/system";


const tool = useToolStore()
const props = defineProps<{
  toolCtx: Tool
}>()

</script>


<style scoped>

</style>