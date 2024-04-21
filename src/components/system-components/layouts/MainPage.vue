<template>
  <q-page id="page-view" class="column justify-center">
    <slot>

    </slot>
  </q-page>
</template>

<script setup lang="ts">

import {onMounted} from "vue";
import {useAppStore} from "@/store/app";

const app = useAppStore()


onMounted(async () => {
  let byId = document.getElementById("page-view");
  app.ui.page.height = byId.style.minHeight
})
</script>


<style scoped>
#page-view {
  overflow: hidden;
}
</style>