<!-- 符合消息渲染 -->
<template>
  <div class="multiple-message">

  </div>
</template>

<script setup lang="ts">

import {ref} from "vue";
import {useChatCtxStore} from "@/components/system-components/tool/chatGptTool/chat/store/chat_ctx";
import {userStore} from "@/store/user";
import {MessageItem} from "@/components/system-components/tool/chatGptTool/chat/model/chat";


const ctx = useChatCtxStore()
const user = userStore()

const props = defineProps<{ message?: MessageItem }
>()

let info = props.message!

const send = ref(false)

// 混合消息包含了多条单个消息组装而成
const list = ref<MessageItem[]>([])

const direction = ref('row-reverse')
const direction_text = ref('row-reverse')

send.value = user.info.user.account == info.sendID

if (!send.value) {
  direction.value = 'to'
}

const bg = ref('light-green')

const text = ref('black')

if (!send.value) {
  bg.value = 'grey-1'
  text.value = 'black'
  direction.value = 'row'
  direction_text.value = 'row'
}
</script>

<style scoped>
.multiple-message {
  max-width: 100%;
  word-wrap: break-word;
  padding: 5px;
  border-radius: 5px;
  background-color: v-bind('getPaletteColor(bg)');
  color: v-bind('getPaletteColor(text)');
}
</style>