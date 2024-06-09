<template>
  <div class="fit">
    <q-list dense>
      <PluginItem v-for="item in ctx.ui.plugins" :plugin="item"/>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import PluginItem from "@/components/tool-components/chatGptTool/widget/plugins/PluginItem.vue";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";

const ctx = useGptStore()
</script>


<style scoped>

</style>