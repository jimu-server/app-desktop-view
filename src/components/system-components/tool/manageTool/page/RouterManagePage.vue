<template>
  <main-page>
    <div id="router" class="row justify-center">
      <div class="full-height" style="width: 98%">
        <RouterTable/>
      </div>
    </div>
  </main-page>
</template>

<script setup lang="ts">
import {useAppStore} from "@/store/app";

const app = useAppStore()
</script>


<style scoped>
#router {
  height: v-bind('app.ui.page.height');
}
</style>