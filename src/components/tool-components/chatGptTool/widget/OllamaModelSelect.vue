<template>
  <q-select borderless v-model="ctx.ui.currentModel" :options="ctx.ui.modelList" dense options-dense
            option-label="name" option-value="model"
            dropdown-icon="jimu-xiangxia-2">
    <template #prepend>
      <q-icon class="chat-tool-opt" size="25px" :name="'img:'+ctx.ui.currentModel.picture"/>
    </template>
    <template v-slot:selected>
      <div class="ellipsis">
        {{ ctx.ui.currentModel.name }}
      </div>
    </template>
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps" v-if="scope.opt.isDownload">
        <q-item-section>
          <q-item-label> {{ scope.opt.name }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import {useGptStore} from "@/components/tool-components/chatGptTool/chat/store/gpt";

const ctx = useGptStore()
</script>


<style scoped>

</style>