<template>
  <div class="fit column" style="overflow: hidden">
    <!-- 用户头像及其在线状态 -->
    <q-toolbar style="height: 5%;width: 100%;border-bottom: rgba(140,147,157,0.34) 1px solid">
      <div class="row" style="margin-left: 10px;height: 100%">
        <div class="column justify-center" style="margin-left: 5px">
          <div class="row">
            <div style="margin-left: 5px;margin-right:10px;user-select: none;">
              {{ ctx.CurrentChat.Current.Conversation.title }}
            </div>
          </div>
        </div>
      </div>
      <q-space/>
      <MessageHeaderBar/>
    </q-toolbar>
    <div class="column relative-position" style="flex-grow:1;overflow-x: hidden;">
      <!--      <q-intersection
                v-for="(item,index) in ctx.CurrentChat.messageList"
                :key="index"
            >
              <chat-message :message="item" :index="index"/>
            </q-intersection>-->
      <q-scroll-area
          ref="scrollAreaRef"
          id="messageScrollArea"
          class="fit"
          :visible="false"
          @scroll="scroll"
                     style="overflow-x: hidden;">
        <!--        &lt;!&ndash; 更具实际布局对照,消息大于多少条时切换到 &ndash;&gt;
                <q-infinite-scroll v-if="ctx.CurrentChat.messageList.length>10" :visible="false" :offset="0" reverse
                                   style="width: 100%"
                                   @load="loadMessage">
                  <q-intersection
                  >
                    <template v-for="(item,index) in ctx.CurrentChat.messageList">
                      <chat-message :message="item" :index="index"/>
                    </template>
                  </q-intersection>
                  &lt;!&ndash;          <template v-for="(item,index) in ctx.CurrentChat.messageList">
                              <chat-message :message="item" :index="index"/>
                            </template>&ndash;&gt;
                  <template v-slot:loading>
                    <div class="row justify-center q-my-md">
                      <q-spinner-ios color="primary" size="20px"/>
                    </div>
                  </template>
                </q-infinite-scroll>
                &lt;!&ndash; 不显示滚动加载消息操作 &ndash;&gt;
                <div v-else>
                  <template v-for="(item,index) in ctx.CurrentChat.messageList">
                    <chat-message :message="item" :index="index"/>
                  </template>
                </div>-->
        <template v-for="(item,index) in ctx.CurrentChat.messageList">
          <chat-message :message="item" :index="index"/>
        </template>
      </q-scroll-area>
      <q-btn
          v-show="showBackBottom"
          class="absolute-bottom-right"
          rounded color="primary"
          flat
          dense
          icon="jimu-a-ziyuan207"
          @click="move_scroll_bottom"
          style="margin-right: 7px;margin-bottom: 5px"
      />
    </div>
  </div>
</template>


<script setup lang="ts">
import {computed, onUnmounted, ref, watch} from "vue";
import emitter from "@/plugins/event";
import {MessageObserver, ScrollMove, SendActionScroll, TypewriterScrollMove} from "@/plugins/evenKey";
import {useThemeStore} from "@/components/system-components/store/theme";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import {MessageType} from "@/components/tool-components/chatGptTool/model/chat";
import {updateTheme} from "@/components/tool-components/chatGptTool/style/update";
import MenuItem from "@/components/system-components/widget/MenuItem.vue";
import OllamaModelSelect from "@/components/tool-components/chatGptTool/widget/OllamaModelSelect.vue";
import KnowledgeFileManage from "@/components/tool-components/chatGptTool/widget/knowledge/KnowledgeFileManage.vue";
import ChatMessage from "@/components/tool-components/chatGptTool/chat/message/ChatMessage.vue";
import MessageHeaderBar from "@/components/tool-components/chatGptTool/chat/message/MessageHeaderBar.vue";

const scrollAreaRef = ref()
const ctx = useGptStore()
const previousScrollTop = ref(0)
// 记录滚动方向 true:向下,false:向上
const scrollDirection = ref(true)
defineExpose({
  MoveScrollBottom,
})


const showBackBottom = computed(() => {
  if (scrollAreaRef.value) {
    let percentage = scrollAreaRef.value.getScrollPercentage();
    if (percentage.top < 0.7 && scrollDirection.value) {
      return true;
    }
  }
  return false
})

function scroll(value) {
  if (scrollAreaRef.value) {
    const scrollTarget = scrollAreaRef.value.getScrollTarget()
    // 获取当前滚动条位置
    const currentScrollTop = scrollTarget.scrollTop

    if (currentScrollTop > previousScrollTop.value) {
      console.log('Scrolling down')
      scrollDirection.value = true
    } else {
      console.log('Scrolling up')
      scrollDirection.value = false
    }
    previousScrollTop.value = currentScrollTop
  }
}

/*
* @description: 移动滚动条到最底部
* */
function MoveScrollBottom() {
  move_scroll_bottom()
  // 处理大量消息的动态渲染,第一次滚动到底部会不完整,需要补偿,递归调用,直到滚动到底部
  setTimeout(() => {
    move_scroll_bottom()
  }, 1000)
}

function move_scroll_bottom() {
  if (scrollAreaRef.value) {
    let percentage = scrollAreaRef.value.getScrollPercentage();
    if (percentage.top <= 1) {
      let scrollTarget = scrollAreaRef.value.getScrollTarget()
      let height = scrollTarget.scrollHeight
      scrollAreaRef.value.setScrollPosition('vertical', height)
    }
  }
}


function typewriter_move_scroll() {
  if (scrollAreaRef.value) {
    let percentage = scrollAreaRef.value.getScrollPercentage();
    if (percentage.top <= 1) {
      let scrollTarget = scrollAreaRef.value.getScrollTarget()
      let height = scrollTarget.scrollHeight
      scrollAreaRef.value.setScrollPosition('vertical', height)
    }
  }
}


/*
* @description: 接收消息触发消息滚动
* */
function MoveScroll() {
  if (ctx.ui.showChat) {
    setTimeout(() => {
      // 获取当前滚动条所处位置的比例
      let percentage = scrollAreaRef.value.getScrollPercentage();
      if (percentage.top > 0.6) {
        let scrollTarget = scrollAreaRef.value.getScrollTarget()
        let height = scrollTarget.scrollHeight
        scrollAreaRef.value.setScrollPosition('vertical', height)
      }
    }, 200)
  }
}

/*
* @description 发送消息触发 消息面板消息滚动
* */
function SendActionMoveScroll() {
  // 必须延迟跟新,否则 api 无法感知到 ui 高度变化
  setTimeout(() => {
    let scrollTarget = scrollAreaRef.value.getScrollTarget()
    let height = scrollTarget.scrollHeight
    scrollAreaRef.value.setScrollPosition('vertical', height)
  }, 100)
}

let options = {
  root: document.getElementById("messageScrollArea"),
};
let observer = null

function beginObserver() {
  // 当前消息数量 小于50条数据不需要进行优化,不执行元素观察优化
  if (ctx.CurrentChat.messageList.length < 50) {
    return
  }
  // 创建元素观察器
  if (observer != null) {
    observer.disconnect()
  }
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      let perId = ((entry.target.previousSibling) as HTMLElement).id
      let id = entry.target.id
      let nextId = ((entry.target.nextSibling) as HTMLElement).id
      if (entry.isIntersecting) {
        if (entry.target.previousSibling) {
          if (!ctx.view.includes(perId)) {
            ctx.view.push(perId)
          }
        }
        if (entry.target.nextSibling) {
          if (!ctx.view.includes(nextId)) {
            ctx.view.push(nextId)
          }
        }
        if (!ctx.view.includes(id)) {
          ctx.view.push(id)
        }
      } else {
        // 元素离开可视区域,可显示数量超过一定数量就随机删除显示数据
        if (ctx.view.length > 15) {
          ctx.view.splice(0, ctx.view.length - 10)
        }
      }
    });
  }, options);

  let elements = document.querySelectorAll('.message-entity');
  elements.forEach(element => {
    observer.observe(element)
  })
}

const theme = useThemeStore()
setTimeout(() => {
  updateTheme(theme.dark)
}, 500)
watch(() => theme.dark, (value) => {
  updateTheme(value)
})

emitter.on(MessageObserver, beginObserver)
emitter.on(ScrollMove, MoveScroll)
emitter.on(SendActionScroll, SendActionMoveScroll)
emitter.on(TypewriterScrollMove, typewriter_move_scroll)

onUnmounted(() => {
  emitter.off(ScrollMove, MoveScroll)
  emitter.off(SendActionScroll, SendActionMoveScroll)
  emitter.off(TypewriterScrollMove, typewriter_move_scroll)
})


</script>

<style scoped>

</style>