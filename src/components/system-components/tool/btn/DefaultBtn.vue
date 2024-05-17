<template>
  <ToolButton :btn="btn" @receive="receive" :position="position"/>
</template>


<script setup lang="ts">
import {useQuasar} from "quasar";
import {Tool} from "@/components/system-components/model/system";
import ToolButton from "@/components/system-components/layouts/tool/ToolButton.vue";


const props = defineProps<{
  btn: Tool
  position: number
}>()


function receive(data) {
  console.log(data)
}

</script>


<style scoped>

</style>