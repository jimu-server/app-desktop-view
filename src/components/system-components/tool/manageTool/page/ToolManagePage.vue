<template>
  <main-page>
    <div id="tool" class="row justify-center">
      <div class="full-height" style="width: 98%">
        <ToolTable/>
      </div>
    </div>
  </main-page>
</template>

<script setup lang="ts">
import {useAppStore} from "@/store/app";

const app = useAppStore()
</script>

<style scoped>
#tool {
  height: v-bind('app.ui.page.height');
}
</style>