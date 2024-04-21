<template>
  <q-item
      :key="item.Conversation!.id"
      :focused="item!.focused"
      :active="item!.active"
      clickable
      @click="selectChat(item,index)"
      :active-class="item.active? 'chat-active text-white' : 'text-black'"

  >
    <!--    好友头像     -->
    <q-item-section avatar>
      <q-avatar>
        <img :src="item.Conversation!.picture===''?ctx.gptDefaultAvatar:item.Conversation!.picture"
             alt="" style="user-select: none"/>
      </q-avatar>
    </q-item-section>
    <q-item-section>
      <q-item-label style="white-space: nowrap">
        <div class="full-width row justify-between" style="overflow: hidden;white-space: nowrap;">
          <!--    会话名称      -->
          <div class="ellipsis" style="user-select: none">
            {{ item.Conversation!.title }}
          </div>
          <!--    会话时间戳      -->
          <div :class="item.active? 'ellipsis text-white' : 'ellipsis text-grey-6'"
               style="user-select: none;overflow: hidden">
            {{ formatTime(item.Conversation.lastTime) }}
          </div>
        </div>
      </q-item-label>
      <q-item-label>
        <div class="full-width row ellipsis">
          <!-- 会话最后一条消息 -->
          <div :class="item.active? 'ellipsis text-white' : 'ellipsis text-grey-7'" style="flex: 1;user-select: none">
            {{ latestMsg(item.Conversation) }}
          </div>
          <!--          <div>
                      <q-badge label="10"/>
                    </div>-->
        </div>
      </q-item-label>
    </q-item-section>
    <ConversationItemMenu :list="list" :ConversationItem="item.Conversation"/>
  </q-item>
</template>

<script setup lang="ts">

import {formatTime} from "@/components/system-components/utils/systemutils";

import {ConversationEntity} from "@/components/system-components/tool/chatGptTool/chat/model/chat";
import {useChatCtxStore} from "@/components/system-components/tool/chatGptTool/chat/store/chat_ctx";
import {AppChatConversationItem} from "@/components/system-components/tool/chatGptTool/chat/model/gpt";
import {ref} from "vue";
import {delConversation, getConversation} from "@/components/system-components/tool/chatGptTool/chatRequest";
import {ElMessage} from "element-plus";
import {IsEmpty} from "@/components/system-components/tool/chatGptTool/chat/chatutils";

defineProps<{
  item: ConversationEntity,
  index: number
}>()

const emits = defineEmits(
    {
      select: (item: ConversationEntity, index: number) => void {}
    }
)

const ctx = useChatCtxStore()

const list = ref([
  {
    name: "删除会话",
    icon: "jimu-shanchu",
    action: (Conversation: AppChatConversationItem) => {
      let flag = false
      if (!IsEmpty(ctx.CurrentChat.Current)) {
        // 判断当前删除的会话是否是当前会话
        flag = ctx.CurrentChat.Current.Conversation!.id === Conversation.id
      }
      delConversation(Conversation.id).then(data => {
        if (data.code === 200) {
          ElMessage({
            message: "删除会话成功",
            type: "success",
            plain: true,
          })
          getConversation().then(data => {
            ctx.setConversation(data)
            if (flag) {
              // 设置一个默认选中会话
              if (ctx.CurrentChat.conversationList.length > 0) {
                ctx.SetCurrentChat(ctx.CurrentChat.conversationList[0], 0)
              }
            }
          })
        }
      })
    }
  }
])


async function selectChat(data: ConversationEntity, index: number) {
  emits('select', data, index)
}

/*
*  @description 处理渲染当前聊天的最后一条消息
* */
function latestMsg(conver: AppChatConversationItem) {
  if (conver.lastMsg.length == 50) {
    return conver.lastMsg.substring(0, 50) + '...'
  }
  return conver.lastMsg
}
</script>


<style scoped>

</style>