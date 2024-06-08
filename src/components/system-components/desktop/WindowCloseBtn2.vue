<script setup lang="ts">
import {ipcRenderer} from "electron";
import {desktop_close} from "@/components/system-components/desktop/desktop";
import {usePlatformStore} from "@/store/platform";
const platform = usePlatformStore()
</script>

<template>
  <q-btn v-if="platform.isDesktop()" dense square flat class="close-btn" icon="jimu-guanbi" @click.stop="desktop_close"
         style="height: 100%;width: 43px;-webkit-app-region: no-drag;font-size: 10px"/>
</template>

<style scoped>
.close-btn:hover {
  background: red;
  color: white;
}

</style>