<template>
  <div class="fit">
    {{ value }}
  </div>
</template>


<script setup lang="ts">
import {getCurrentInstance, inject, onMounted, ref} from "vue";

const value = ref(1)
const getNode = inject<Function>('getNode')

onMounted(() => {
  let node = getNode()
  node.on('change:data', ({current}) => {
    console.log("change:data", current)
  })
})

</script>


<style scoped>

</style>