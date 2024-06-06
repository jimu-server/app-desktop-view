<template>
  <main-page>
    <div id="tool" class="fit row justify-center">
      <ToolTable/>
    </div>
  </main-page>
</template>

<script setup lang="ts">
import {useAppStore} from "@/store/app";

const app = useAppStore()
</script>

<style scoped>
#tool {

}
</style>