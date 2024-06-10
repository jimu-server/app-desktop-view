<template>
  <div>
    <div class="row justify-between">
      <div>
        <q-chip
            size="md"
            icon="jimu-xitongmoxingchajian"
            style="cursor: default"
            :color="toggleColer"
        >
          {{ ctx.ui.currentPlugin.name }}
        </q-chip>
      </div>
    </div>
    <q-menu
        id="plugin-menu"
        v-model="show"
        clickable
        anchor="top start" self="bottom start"
        transition-show="scale"
        transition-hide="scale"
        style="overflow: hidden;width: 150px"
        :persistent="ctx.ui.pluginMenuShowFlag"
    >
      <PluginView/>
    </q-menu>
  </div>
</template>

<script setup lang="ts">

import PluginView from "@/components/tool-components/chatGptTool/widget/plugins/PluginView.vue";
import {computed, onMounted, ref, watch} from "vue";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import {getPlugins} from "@/components/tool-components/chatGptTool/chatRequest";
import {useThemeStore} from "@/store/theme";

const ctx = useGptStore()
const theme = useThemeStore()
const show = ref(false)

const toggleColer = computed(() => {
  return theme.dark ? "grey-10" : "grey-2"
})


watch(() => theme.dark, (value) => {

})

onMounted(async () => {
  ctx.ui.plugins = await getPlugins()
  // 默认选中第一个插件
  if (ctx.ui.plugins.length > 0) {
    ctx.ui.currentPlugin = ctx.ui.plugins[0]
  }

})
</script>


<style scoped>

</style>