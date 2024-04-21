<script setup lang="ts">
import {ipcRenderer} from "electron";

function close() {
  ipcRenderer.send('window-quite')
}
</script>

<template>
  <q-btn dense square flat class="close-btn" icon="jimu-guanbi" @click.stop="close"
         style="height: 100%;width: 40px;-webkit-app-region: no-drag;"/>
</template>

<style scoped>
.close-btn:hover {
  background: red;
  color: white;
}
</style>