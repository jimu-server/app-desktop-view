<template>
  <q-dialog
      v-model="model"
  >
    <q-card
        style="width: 40vw;height: 50vh"
        class="column"
    >
      <q-bar>
        <q-space/>
        <q-btn class="close-btn" dense flat icon="jimu-guanbi-2" style="align-content: center" @click="model=false"/>
      </q-bar>
      <div style="flex-grow: 1">
        <q-scroll-area class="fit" :visible="false">
          <q-list>
            <DownloadItem :item="{}"/>
          </q-list>
        </q-scroll-area>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {onMounted} from "vue";
import {useGptStore} from "@/components/tool-components/chatGptTool/chat/store/gpt";
import DownloadItem from "@/components/tool-components/chatGptTool/manage/DownloadItem.vue";

const model = defineModel({default: false})
const ctx = useGptStore()

function clean() {
  model.value = false
}

function addDownload(value: any) {

}

onMounted(() => {
  for (const download of ctx.ui.downloadModelList) {
    // 数据如果为下载完成则启动下载
    if (download.isDownload) {
      addDownload(download)
    }
  }
})

</script>

<style scoped>
.close-btn:hover {
  color: whitesmoke;
  background-color: red;
}
</style>