<template>
  <main-page>
    <q-splitter
        class="fit"
        v-model="splitterModel"
        :limits="splitterModelLimit"
        id="chatview"
        before-class="conversations"
        after-class="chat"
        separator-class="separator"
    >
      <!--   聊天会话消息列表   -->
      <template v-slot:before>
        <div ref="conversationListRef" class="fit column" style="overflow: hidden;">
          <div class="row justify-center" style="padding: 7px">
            <search-input width="100%" @search="search"/>
          </div>
          <div style="overflow:hidden;flex-grow: 1">
            <q-scroll-area :visible="false" class="fit">
              <div class="fit" style="overflow:hidden;">
                <q-list padding style="padding: 12px">
                  <ConversationItemLabel
                      v-for="(item,index) in ctx.sortConversation"
                      :item="item"
                      :index="index"
                      @select="selectChat"
                      style="transition: all 0.5s ease;"
                  />
                </q-list>
              </div>
            </q-scroll-area>
          </div>
        </div>
      </template>

      <!--   聊天消息展示以及消息输入面板   -->
      <template v-slot:after>
        <q-splitter
            v-if="ctx.ui.showChat "
            v-model="splitterModel2"
            :limits="splitterModel2Limit"
            horizontal
            reverse
            separator-class="separator"
            style="overflow: hidden"
        >
          <!--    消息展示面板    -->
          <template v-slot:before>
            <MessagePanel ref="messageListRef"/>
          </template>

          <!--     消息输入面板     -->
          <template v-slot:after>
            <ChatEditorPlus @send="send" @max-editor="maxInput"/>
          </template>
        </q-splitter>
        <div v-else class="fit row justify-center">
          <div class=" column justify-center">
            <q-icon name="img:./ai.svg" size="500px"/>
          </div>
        </div>
      </template>
    </q-splitter>
  </main-page>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";


import {UpdateChatViewUI} from "@/plugins/evenKey";
import {colors} from "quasar";
import emitter from "@/plugins/event";
import SearchInput from "@/components/tool-components/chatGptTool/widget/SearchInput.vue";

import {useAppStore} from "@/store/app";
import {ElMessage} from "element-plus";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import {IsEmpty} from "@/components/tool-components/chatGptTool/chat/chatutils";
import {
  ChatMessageEntity,
  ConversationEntity,
  MessageType
} from "@/components/tool-components/chatGptTool/model/chat";
import {SendTextMessage} from "@/components/tool-components/chatGptTool/gptutil";
import draggable from 'vuedraggable'

const {getPaletteColor} = colors

const app = useAppStore()
const splitterModel = ref(20)
const splitterModelLimit = ref([20, 30])
const splitterModel2 = ref(30)
const splitterModel2Limit = ref([30, 50])
const conversationListRef = ref()
const messageListRef = ref()
const ctx = useGptStore()

if (!IsEmpty(ctx.CurrentChat.Current)) {
  ctx.ui.showChat = true
}

function selectChat(data: ConversationEntity, index: number) {
  if (!IsEmpty(ctx.CurrentChat.Current) && ctx.CurrentChat.Current.Conversation.id === data.Conversation.id) {
    return;
  }
  // 当前消息处于回复状态,禁止切换会话
  if (ctx.ui.replying) {
    ElMessage({
      message: 'GPT消息回复中,请停止或中断回话后切换',
      type: 'warning',
      duration: 2000,
      showClose: true,
      grouping: true,
      plain: true
    })
    return
  }
  // 切换当前会话消息选中状态
  ctx.SetCurrentChat(data, index)
  setTimeout(() => {
    if (messageListRef.value != null) {
      messageListRef.value.MoveScrollBottom()
    }
  }, 100)
}
/*
* @description: 正常消息编辑器发送消息
* */
async function send(message: ChatMessageEntity[]) {
  // 计算当前用户发送的消息对于回复gpt的那条消息
  let messageId = ""
  if (ctx.CurrentChat.messageList.length > 0) {
    let data = ctx.CurrentChat.messageList[ctx.CurrentChat.messageList.length - 1]
    // 如果最后一次的消息依就是用户的,gpt那边没有,应该认为这一条用户消息为一个新消息
    if (data.role !== 'user') {
      messageId = data.id
    }
  }
  for (const item of message) {
    switch (item.contentType) {
        // 文本消息,包含表情
      case MessageType.TextMessage:
        await SendTextMessage(messageId, item.data)
        break
        // 图片消息
      case MessageType.PictureMessage:
        // await SendImageMessage(item)
        break
        // 自定义消息类型
      case MessageType.CustomMessage:
        break
    }
  }
}

/*
* @description 编辑器最大化事件触发
* */
function maxInput() {
  if (splitterModel2.value != 100) {
    splitterModel2.value = 100
    splitterModel2Limit.value = []
    return
  }
  splitterModel2.value = 30
  splitterModel2Limit.value = [30, 50]
}

emitter.on(UpdateChatViewUI, init)

async function init() {
  // 加载会话
  await ctx.GetConversationList()
  // 加载模型
  await ctx.GetModelList()

  // 状态数据 更新 会话ui 需要对 showChat 参数进行重置
  await ctx.GetConversationList()
}

function search(value: string) {
  ctx.ui.search = value
}


onMounted(init)


</script>
<style scoped>

#chat-page {
  overflow: hidden;
}

.chat-tool-opt {
  margin-left: 10px;
}

.chat-tool-opt:hover {
  color: v-bind('getPaletteColor("primary")');
}


.list-enter-active, .list-leave-active {
  transition: all 0.5s;
}
.list-enter, .list-leave-to /* .list-leave-active for <2.1.8 */ {
  /*opacity: 0;*/
  /*transform: translateY(30px);*/
}
.list-move {
 /* transition: transform 0.3s;*/
}


</style>


<style>

.separator {
  cursor: default;
  /*  background: v-bind('getPaletteColor("primary")');*/
}

#chatview .q-scrollarea__content.absolute {
  width: 100%;
}

#chatview .q-splitter__separator {
  cursor: default;

}

#chatview .q-splitter__separator-area.absolute-full {
  cursor: default;
}

#chatview .cursor-pointer {
  cursor: default !important;
}

/* Quasar 删除滑块外层的 透明效果 */
body.desktop .q-toggle:not(.disabled):focus .q-toggle__thumb:before, body.desktop .q-toggle:not(.disabled):hover .q-toggle__thumb:before {
  transform: none !important;
}

</style>