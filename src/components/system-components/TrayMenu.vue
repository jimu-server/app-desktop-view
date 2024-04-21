<template>
  <div class="column justify-end fit" @mouseover="keepTray">
    <q-list dense>
      <q-item clickable style="padding: 5px">
        <MenuItem text="退出"/>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">

import MenuItem from "@/components/desktop/widget/MenuItem.vue";
import {onMounted} from "vue";
import {ipcRenderer} from "electron";


function keepTray(event) {
  ipcRenderer.send("close-tray");
}

onMounted(() => {

})

</script>


<style scoped>

</style>