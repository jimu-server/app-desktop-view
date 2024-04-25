<template>
  <main-page>
    <ChatPanel/>
  </main-page>
</template>

<script setup lang="ts">


import MainPage from "@/components/system-components/layouts/MainPage.vue";

import {onMounted} from "vue";
import {useGptStore} from "@/components/tool-components/chatGptTool/chat/store/gpt";

const ctx = useGptStore()
onMounted(() => {
  // 加载会话
  ctx.GetConversationList()
  // 加载模型
  ctx.GetModelList()
})

</script>


<style scoped>

</style>