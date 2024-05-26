<template>
  <div>
    <q-icon size="16px" class="edit-tool-option" name="jimu-xitongmoxingchajian">
      <q-tooltip :offset="[0, 0]">
        插件
      </q-tooltip>
    </q-icon>
    <q-menu
        id="plugin-menu"
        anchor="top start" self="bottom start"
        transition-show="scale"
        transition-hide="scale"
        style="overflow: hidden"
    >
      <PluginView/>
    </q-menu>
  </div>
</template>

<script setup lang="ts">

import PluginView from "@/components/tool-components/chatGptTool/widget/plugins/PluginView.vue";
</script>


<style scoped>

</style>