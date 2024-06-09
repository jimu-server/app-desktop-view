<template>
  <div>
    <div class="row justify-between">
      <div>
        <q-chip size="md" icon="jimu-xitongmoxingchajian" style="cursor: default">
          {{ ctx.ui.currentPlugin.name }}
        </q-chip>
      </div>
    </div>
    <q-menu
        id="plugin-menu"
        anchor="top start" self="bottom start"
        transition-show="scale"
        transition-hide="scale"
        style="overflow: hidden;width: 150px"
    >
      <PluginView/>
    </q-menu>
  </div>
</template>

<script setup lang="ts">

import PluginView from "@/components/tool-components/chatGptTool/widget/plugins/PluginView.vue";
import {onMounted} from "vue";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import {getPlugins} from "@/components/tool-components/chatGptTool/chatRequest";

const ctx = useGptStore()

onMounted(async () => {
  ctx.ui.plugins = await getPlugins()
})
</script>


<style scoped>

</style>