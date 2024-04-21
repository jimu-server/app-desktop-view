<template>
  <template v-if="send">
    <div ref="typing" class="markdown-message gpt-message" v-html="info.content"></div>
  </template>
  <template v-else-if="!send">
    <div class="fit" style="position: relative">
      <div ref="typing" class="markdown-message gpt-message" v-html="info.content" v-height></div>
      <div ref="cursor" v-show="showCursor" class="typing-cursor"></div>
    </div>
  </template>
</template>


<script setup lang="ts">
import {onMounted, onUpdated, reactive, ref, watch} from "vue";
import {AppChatMessageItem} from "@/components/system-components/tool/chatGptTool/chat/model/gpt";
import md from "@/components/system-components/tool/chatGptTool/chat/gptMarkDownMessagePreview";
import {SendActionScroll} from "@/plugins/evenKey";
import emitter from "@/plugins/event";
import {useChatCtxStore} from "@/components/system-components/tool/chatGptTool/chat/store/chat_ctx";
import {useThemeStore} from "@/store/theme";
import {getMessage} from "@/components/system-components/tool/chatGptTool/chatRequest";
import {ElNotification} from "element-plus";


const ctx = useChatCtxStore()
const theme = useThemeStore()
const emit = defineEmits({
  // 打字容器高度变化时间
  heightChange: function (value) {
  }
})
const props = defineProps<
    {
      // 消息
      message: AppChatMessageItem,
      index: number
    }
>()
// 打字容器对象
const typing = ref<HTMLElement>()
const cursor = ref<HTMLElement>()
// 是否显示打字光标
const showCursor = ref(false)
// 打字机 光标显示位置
const pos = reactive({
  x: 0,
  y: 0,
})

// 渲染消息文本存储
const info = ref({...props.message!})
// 存储流消息拼接文本
const content = ref('')
// 初始化默认渲染数据
info.value.content = md.render(info.value.content)

// 标识当前消息是否是用户发送的
const send = ref(false)

// 获取消息发送标识,处理发送消息内容方向
send.value = props.message.role === 'user'

// 消息方向 设置
const direction = ref('row-reverse')
const direction_text = ref('row-reverse')


if (!send.value) {
  direction.value = 'row'
  direction_text.value = 'row'
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function beginTyping() {
  // 非用户身份 使用 stream 加载流消息
  setTimeout(async () => {
    if (!send.value && info.value.content === "") {
      ctx.ui.replying = true
      const response = info.value.stream;
      const reader = response.body.getReader()
      showCursor.value = true
      try {
        while (true) {
          // 如果执行停止操作则结束打字
          if (ctx.ui.stop) {
            // 检查中断标识 true 表示 需要中断
            await reader.cancel()
            // 延迟查询消息补偿提前结束无法及时取出的消息
            setTimeout(async () => {
              let message = await getMessage(props.message.id);
              console.log(message.content)
              ctx.UpdateConversationLastMsg(props.message.conversationID, message.content, props.message.picture)
              end()
            }, 1000)
            console.log("typing stop..")
            return
          }
          const result = await reader.read();
          if (result.done) break;
          if (!do_typing(result.value)) break
          // 如果执行停止操作则结束打字
          if (ctx.ui.stop) {
            // 检查中断标识 true 表示 需要中断
            await reader.cancel()
            // 延迟查询消息补偿提前结束无法及时取出的消息
            setTimeout(async () => {
              let message = await getMessage(props.message.id);
              console.log(message.content)
              ctx.UpdateConversationLastMsg(props.message.conversationID, message.content, props.message.picture)
              end()
            }, 1000)
            console.log("typing stop..")
            return
          }
        }
        console.log("typing end..")
        ctx.UpdateConversationLastMsg(props.message.conversationID, content.value, props.message.picture)
        end()
      } catch (error) {
        console.error("Stream reading error:", error);
      }

    }
  }, 300);
}

const decoder = new TextDecoder();

function do_typing(value): boolean {
  let decodedData = decoder.decode(value);
  let accumulatedData = ""; // Accumulate chunks of data here
  accumulatedData += decodedData;
  accumulatedData.split('\n').forEach(line => {
    if (line) {
      try {
        let parsed = JSON.parse(line);
        // 检查当前的流消息是否出现错误
        if (checkError(parsed)) {
          return false;
        }
        if (parsed.message.content) {
          // 保存原始消息
          content.value += parsed.message.content
          // 渲染 md 消息进行展示
          info.value.content = md.render(content.value);
          // 发送滚动条滚动指令
          emitter.emit(SendActionScroll)
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        console.error(line)
      }
    }
  });
  return true;
}


/*
* @description 检查当前的消息类型 ,在流式消息返回中发现了 正常响应的消息结构,则表示出现了问题
* */
function checkError(value) {
  let code = hasOwnProperty(value, "code");
  let msg = hasOwnProperty(value, "msg");
  let err = hasOwnProperty(value, "data");
  if (code && msg && err) {
    if (value.code != 200) {
      ElNotification({
        title: '系统消息',
        message: value.msg,
        type: 'error'
      })
      return true;
    }
  }
  return false;
}

function hasOwnProperty(obj: object, prop: string) {
  return obj.hasOwnProperty(prop);
}

function end() {
  // 关闭正在回复状态
  ctx.ui.replying = false
  // 打字结束取消光标展示
  showCursor.value = false
  // 重置取消回复标识
  ctx.ui.stop = false
  console.log("Refresh status")
}


// 自定义指令监听dvi的高度变化
const vHeight = {
  updated(el, binding, vnode, prevVnode) {
    emit('heightChange', el.clientHeight)
  },
}

/*
* @description: 找到打字容器最后一个字符位置
* */
function getLastTextNode(dom: HTMLElement) {
  if (dom.childNodes.length === 0) {
    return null;
  }
  if (dom.childNodes.length === 1) {
    return dom.childNodes[0];
  }
  for (let i = dom.childNodes.length - 1; i >= 0; i--) {
    let node = dom.childNodes[i];
    if (node.nodeType === Node.TEXT_NODE && /\S/.test(node.nodeValue)) {
      node.nodeValue = node.nodeValue.replace(/\s+$/, '')
      return node;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      let last = getLastTextNode(node as HTMLElement);
      if (last) {
        return last;
      }
    }
  }
  return null;
}

/*
* @description: 计算打字容器光标显示位置
* */
function updateCursor() {
  let el = typing.value
  if (!el) {
    return
  }
  let lastTextNode = getLastTextNode(typing.value);
  // 创建一个不可显示字符
  let textNode = document.createTextNode("\u200b")
  // 根据最后一个节点的情况 把字符添加到容器或者最后一个节点上 用于占位
  if (lastTextNode) {
    lastTextNode.parentElement.appendChild(textNode)
  } else {
    typing.value.appendChild(textNode)
  }
  // 计算占位的距离
  const domRect = typing.value.getBoundingClientRect()
  let range = document.createRange()
  range.setStart(textNode, 0)
  range.setEnd(textNode, 0)
  let rect = range.getBoundingClientRect()
  // 更新光标位置到占位符号
  pos.x = rect.left - domRect.left
  pos.y = rect.top - domRect.top
  // 移除占位符号
  textNode.remove()
}


/*
* @description: 如果消息是gpt消息则加载周期事件
* */
if (!send.value) {
  onMounted(() => {
    updateCursor()
    beginTyping()
  })
  onUpdated(updateCursor)
}

if (theme.dark) {
  typing.value.setAttribute('theme', 'dark')
  cursor.value.setAttribute('theme', 'dark')
}
</script>

<style scoped>

.typing-cursor[theme="dark"] {
  color: #fff !important;
}
.typing-cursor {
  content: '';
  position: absolute;
  width: 10px;
  height: 18px;
  animation: toggle 0.5s linear infinite;
  opacity: 0;
  left: calc(v-bind('pos.x') * 1px);
  top: calc(v-bind('pos.y') * 1px);
}
@keyframes toggle {
  30% {
    opacity: 1;
  }
}
</style>
