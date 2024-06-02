<template>
  <div class="text-primary">
    {{ ctx.message }}
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";

const props = defineProps<{
  data: string
}>()

const ctx = ref<any>()
ctx.value = JSON.parse(props.data)

</script>


<style scoped>

</style>