<script setup lang="ts">
import {ipcRenderer} from "electron";
import {desktop_close} from "@/components/system-components/desktop/desktop";
import {usePlatformStore} from "@/store/platform";

const platform = usePlatformStore()
</script>

<template>
  <q-btn  dense square flat class="close-btn" icon="jimu-guanbi" @click.stop="desktop_close"
         style="height: 100%;width: 43px;-webkit-app-region: no-drag;font-size: 10px"/>
</template>

<style scoped>
.close-btn:hover {
  background: red;
  color: white;
}

/* 处理 桌面窗口关闭时候的圆角问题 */
.close-btn {
 /* border-top-right-radius: 10px;*/
}
</style>