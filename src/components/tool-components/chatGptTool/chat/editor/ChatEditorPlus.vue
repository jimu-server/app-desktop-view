<template>
  <div class="edit fit">
    <div class="edit-tool row">
      <ToolWidget>
        <GPTSettingPanel/>
      </ToolWidget>
      <ToolWidget>
        <KnowledgeBasePanel/>
      </ToolWidget>
      <div class="column justify-center">
        <q-toggle v-model="ctx.ui.autoHistory" size="sm" color="primary" checked-icon="jimu-shijian-2">
          <q-tooltip :offset="[0, 0]">
            {{ ctx.ui.autoHistory ? '取消上下文' : '开启上下文' }}
          </q-tooltip>
        </q-toggle>
      </div>
      <div class="column justify-center">
        <q-toggle v-model="ctx.ui.autoFold" size="sm" color="primary">
          <q-tooltip :offset="[0, 0]">
            {{ ctx.ui.autoFold ? '取消折叠新消息' : '自动折叠新消息' }}
          </q-tooltip>
        </q-toggle>
      </div>
      <q-space/>
      <!--   终止gpt回答   -->
      <ToolWidget v-show="ctx.ui.replying">
        <div class="row">
          <div class="full-height column justify-center">
            <q-spinner-comment
                color="primary"
                size="sm"
            />
            <q-tooltip :offset="[0, 0]">回复中</q-tooltip>
          </div>
          <div>
            <q-btn dense flat icon="jimu-daochu1024-16" color="red" @click="stopReplying"/>
          </div>
        </div>
      </ToolWidget>
      <div class="column justify-center">
        <q-icon size="20px" class="edit-tool-option" name="jimu-shijian-2">
          <q-tooltip :offset="[0, 0]">
            历史消息
          </q-tooltip>
        </q-icon>
      </div>
      <ToolWidget style="margin-right: 5px">
        <q-icon size="20px" class="edit-tool-option" :name="isMax?'jimu-zuixiaohua':'jimu-zuidahua'"
                @click.stop="max">
        </q-icon>
      </ToolWidget>
    </div>
    <div class="edit-box">
      <Editor
          ref="editRef"
          v-model:characters="characters"
          :shame="shame"
          @input="input"
          @send="sendAction"
      />
    </div>
    <div class="send-box row reverse">
      <div class="column justify-center">
        <q-btn split dense color="primary" label="发 送" icon="jimu-send" @click="sendMessage"
               style="width: 70px;height:30px;margin-right: 10px">
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {colors} from "quasar";
import Editor from "./Editor.vue";
import {IsEmpty} from "@/components/system-components/utils/systemutils";
import {ChatMessageEntity, MessageType} from "@/components/tool-components/chatGptTool/chat/model/chat";
import {useGptStore} from "@/components/tool-components/chatGptTool/chat/store/gpt";
import KnowledgeBasePanel from "@/components/tool-components/chatGptTool/chat/editor/widget/KnowledgeBasePanel.vue";



const {getPaletteColor} = colors

const props = defineProps({
  // ats 属性传递给底层 CKEditor 编辑器 用于提示 @用户的列表
  ats: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits({
  // 发送消息事件 通知外部 ChatEditor 编辑器 需要发送消息
  send: (messages: ChatMessageEntity[]) => {
  },
  // 最大化编辑器事件 需要动态调整布局高度
  MaxEditor: () => {
  },
})

const text = ref('')

const editRef = ref()
const characters = ref(0)
const shame = ref(false)
const ctx = useGptStore()
const info = ref(null)
const isMax = ref(false)
const MaxHeight = ref({
  tool: '15%',
  edit: '60%',
  send: '25%'
})


function stopReplying() {
  ctx.ui.stop = true
}

function max(event) {
  isMax.value = !isMax.value
  if (!isMax.value) {
    MaxHeight.value.tool = '10%'
    MaxHeight.value.edit = '65%'
    MaxHeight.value.send = '5%'
  } else {
    MaxHeight.value.tool = '5%'
    MaxHeight.value.edit = '85%'
    MaxHeight.value.send = '10%'
  }
  emits('MaxEditor')
}

/*
* description: 编辑器输入事件
* */
function input(data: string) {
  let current = ctx.CurrentChat.Current
  // 更新当前的聊天会话消息编辑草稿
  if (!IsEmpty(current)) {
    ctx.chat_editor_content[current.Conversation.id] = data
  }
}

/*
* @description 选择表情
* */
function selectE(data: any) {
  editRef.value.insert({
    contentType: MessageType.TextMessage,
    data: data
  })
}

function sendMessage() {
  let msg = editRef.value.Message()
  emits("send", msg)
  editRef.value.Clear()
  let current = ctx.CurrentChat.Current
  ctx.chat_editor_content[current.Conversation.id] = ''
}

/*
* @description 编辑器触发快捷发送消息动作
* */
function sendAction(data: ChatMessageEntity[]) {
  emits("send", data)
  editRef.value.Clear()
  let current = ctx.CurrentChat.Current
  ctx.chat_editor_content[current.Conversation.id] = ''
}


onMounted(() => {
})

</script>


<style scoped>

.edit {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.edit-tool {
  margin-top: 2px;
  height: v-bind('MaxHeight.tool');
}

.edit-box {
  height: v-bind('MaxHeight.edit');
  width: 100%;
  overflow: hidden
}

.send-box {
  width: 100%;
  height: v-bind('MaxHeight.send');
}

.edit-tool-option {
  margin-left: 10px;
}

.edit-tool-option:hover {
  color: v-bind('getPaletteColor("primary")');
}

</style>

<style>
.q-menu--dark {
  box-shadow: none;
}
</style>