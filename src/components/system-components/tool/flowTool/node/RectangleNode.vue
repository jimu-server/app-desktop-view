<template>
  <BaseNode @resize="resize">
    <div class="rectangle">
      default
    </div>
  </BaseNode>
</template>

<script setup lang="ts">
import {useVueFlow} from "@vue-flow/core";
import {ref} from "vue";

const {updateNodeData} = useVueFlow()
const props = defineProps({
  id: {
    type: String,
  },
})

const width = ref(100)
const height = ref(30)

function resize(w: number, h: number) {
  width.value = w
  height.value = h
}

function onGradient() {
  updateNodeData(props.id, {isGradient: true})
}
</script>


<style scoped>
.rectangle {
  background-color: red;
  width: calc(v-bind('width') * 1px);
  height: calc(v-bind('height') * 1px);
}
</style>