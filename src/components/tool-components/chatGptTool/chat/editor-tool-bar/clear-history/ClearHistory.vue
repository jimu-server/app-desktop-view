<template>
  <q-chip
      icon="jimu-shanchu"
      label="清空历史"
      size="md"
      style="cursor: default"
      :color="toggleColer"
  />
</template>
<script setup lang="ts">
import {computed} from "vue";
import {useThemeStore} from "@/store/theme";

const theme = useThemeStore()
const toggleColer = computed(() => {
  return theme.dark ? "grey-10" : "grey-2"
})
</script>


<style scoped>

</style>