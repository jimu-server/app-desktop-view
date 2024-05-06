<template>
  <div ref="tray" class="column justify-end fit">
    <q-list dense>
      <MenuItem icon="jimu-exit" text="退出" @click="desktop_exit"/>
    </q-list>
  </div>
</template>

<script setup lang="ts">


import {onMounted, ref} from "vue";
import {ipcMain, ipcRenderer} from "electron";
import MenuItem from "@/components/system-components/widget/MenuItem.vue";
import {desktop_exit} from "@/components/system-components/desktop/desktop";

const tray = ref()

function keepTray(event) {
  ipcRenderer.send("close-tray");
}

ipcRenderer.on("open", () => {
  // 打开系统托盘时候获取焦点
  tray.value.focus()
})

// 菜单失去焦点时候隐藏

onMounted(() => {
  tray.value.addEventListener("blur", () => {
    ipcRenderer.send("close-tray")
  })
})

</script>


<style scoped>

</style>