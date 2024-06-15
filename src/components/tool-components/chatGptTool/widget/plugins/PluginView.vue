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

const plugin = useAiPluginStore()
</script>


<style scoped>

</style>