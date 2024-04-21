<script setup lang="ts">
import {ipcRenderer} from "electron";
import {desktop_close} from "@/components/system-components/desktop/desktop";

</script>

<template>
  <q-btn dense square flat class="close-btn" icon="jimu-guanbi" @click.stop="desktop_close"
         style="height: 100%;width: 40px;-webkit-app-region: no-drag;"/>
</template>

<style scoped>
.close-btn:hover {
  background: red;
  color: white;
}
</style>