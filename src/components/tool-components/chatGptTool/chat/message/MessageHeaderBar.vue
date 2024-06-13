<template>
  <!--  <OllamaModelSelect/>-->
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
        <menu-item icon="jimu-chuangjian" text="Open" @click="systemFileSelect=true"/>
      </q-list>
    </q-menu>
  </q-btn>
  <q-btn dense flat icon="jimu-yunxiazai_o">
    <q-badge v-show="ctx.ui.downloadModelList.length>0" rounded color="red" :label="ctx.ui.downloadModelList.length"
             floating transparent/>
    <q-menu>
      <DownloadPanel/>
    </q-menu>
  </q-btn>
  <KnowledgeFileManage v-model="fileManageFlag"/>
  <UserModelManage v-model="userModelManageFlag"/>
  <SystemFileSelectDialog v-model="systemFileSelect"/>
</template>

<script setup lang="ts">

import MenuItem from "@/components/system-components/widget/MenuItem.vue";
import {ref} from "vue";
import KnowledgeFileManage from "@/components/tool-components/chatGptTool/widget/knowledge/KnowledgeFileManage.vue";
import UserModelManage from "@/components/tool-components/chatGptTool/manage/UserModelManage.vue";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import SystemFileSelectDialog from "@/components/system-components/system-file-manage/SystemFileSelectDialog.vue";

const fileManageFlag = ref(false)
const systemFileSelect = ref(false)
const userModelManageFlag = ref(false)
const ctx = useGptStore()

</script>


<style scoped>

</style>