<template>
  <OllamaModelSelect/>
  <q-btn dense flat icon="jimu-caidan1">
    <q-menu
        anchor="bottom end" self="top right"
        fit
        transition-show="scale"
        transition-hide="scale"
        :offset="[13,0]"
    >
      <q-list dense>
        <menu-item icon="jimu-Model" text="我的模型" @click="userModelManageFlag=true"/>
        <menu-item icon="jimu-folderOpen" text="文件管理" @click="fileManageFlag=true"/>
        <menu-item icon="jimu-chuangjian" text="创建模型" @click="ollamaCreateFlag=true"/>
      </q-list>
    </q-menu>
  </q-btn>
  <q-btn dense flat icon="jimu-yunxiazai_o" @click="downloadModelFlag=true"/>
  <KnowledgeFileManage v-model="fileManageFlag"/>
  <UserModelManage v-model="userModelManageFlag"/>
  <DownloadOllamaModel v-model="downloadModelFlag"/>
</template>

<script setup lang="ts">

import OllamaModelSelect from "@/components/tool-components/chatGptTool/widget/OllamaModelSelect.vue";
import MenuItem from "@/components/system-components/widget/MenuItem.vue";
import {ref} from "vue";
import KnowledgeFileManage from "@/components/tool-components/chatGptTool/widget/knowledge/KnowledgeFileManage.vue";
import UserModelManage from "@/components/tool-components/chatGptTool/manage/UserModelManage.vue";


const fileManageFlag = ref(false)
const ollamaCreateFlag = ref(false)
const userModelManageFlag = ref(false)
const downloadModelFlag = ref(false)


</script>


<style scoped>

</style>