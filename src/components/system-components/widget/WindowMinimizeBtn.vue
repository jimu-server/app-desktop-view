<script setup lang="ts">
import {ipcRenderer} from "electron";

function minimize() {
  ipcRenderer.send('window-min')
}
</script>

<template>
  <q-btn dense square flat class="minimize" icon="jimu-zuixiaohua1" @click.stop="minimize"
         style="height: 100%;width: 40px;-webkit-app-region: no-drag;"/>
</template>

<style scoped>
.minimize {

}

.minimize:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>