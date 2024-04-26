<template>
  <div class="file-ui row" @dblclick="dbClick">
    <div class="file-icon">
      <q-icon name="jimu-wenjianjia1" size="24px"/>
    </div>
    <div class="file-name">
      xxxxx
    </div>
  </div>
</template>

<script setup lang="ts">
import {KnowledgeFile} from "@/components/tool-components/chatGptTool/chat/model/model";

const props = defineProps<{
  file?: KnowledgeFile
}>()

function dbClick() {

}

</script>


<style scoped>
.file-ui {
  width: 100%;
  height: 40px;
}

.file-icon {
  align-content: center;
}

.file-name {
  height: 100%;
  align-content: center;
  padding-left: 5px;
}

.file-ui:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #6aa9f3;
}
</style>