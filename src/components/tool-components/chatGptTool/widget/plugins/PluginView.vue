<template>
  <div class="fit">
    <q-list dense>
      <PluginItem v-for="item in plugin.plugins" :data="item"/>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import PluginItem from "@/components/tool-components/chatGptTool/widget/plugins/PluginItem.vue";
import {useAiPluginStore} from "@/components/tool-components/chatGptTool/store/plugin";
import {onMounted} from "vue";
import {getKnowledge, getPlugins} from "@/components/tool-components/chatGptTool/chatRequest";

const plugin = useAiPluginStore()

onMounted(async () => {
  plugin.plugins = await getPlugins()
  // 默认选中第一个插件
  if (plugin.plugins.length > 0) {
    plugin.currentPlugin = plugin.plugins[0]
  }
  // 加载插件数据
  plugin.ctx.knowledge = await getKnowledge()
})
</script>


<style scoped>

</style>