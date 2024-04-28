<template>
  <div class="file-ui row" @dblclick="dbClick">
    <div class="file-icon">
      <q-icon name="jimu-wenjianjia1" size="24px"/>
    </div>
    <div class="file-name">
      {{ info.entity.fileName }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {KnowledgeFile} from "@/components/tool-components/chatGptTool/chat/model/model";
import {Tree} from "@/components/system-components/model/system";
import {useGptStore} from "@/components/tool-components/chatGptTool/chat/store/gpt";

const props = defineProps<{
  info: Tree<KnowledgeFile>
}>()
const ctx = useGptStore()

function dbClick() {
  ctx.ui.knowledge.nva.push(props.info)
  ctx.ui.knowledge.files = props.info.children
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
  user-select: none;
}

.file-ui:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #6aa9f3;
}
</style>