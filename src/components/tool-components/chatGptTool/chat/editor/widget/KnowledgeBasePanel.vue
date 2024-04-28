<template>
  <div id="knowledge">
    <q-icon size="20px" class="edit-tool-option" name="jimu-zhishi">
      <q-tooltip :offset="[0, 0]">
        知识库
      </q-tooltip>
    </q-icon>
    <q-menu
        id="knowledge-menu"
        anchor="top start" self="bottom start"
        transition-show="scale"
        transition-hide="scale"
        style="overflow: hidden"
    >
      <div style="width: 500px;height: 200px;overflow: hidden;padding: 5px;">
        <div class="fit column">
          <div class="full-width row justify-between" style="height: 32px">
            <div class="hull-height column justify-center" style="flex: 1;height: 32px">
              <ScrollX class="fit">
                <div class="fit column justify-center" style="height: 32px">
                  <q-breadcrumbs gutter="none" class="full-width">
                    <q-breadcrumbs-el v-for="(item,index) in ctx.ui.knowledge.nva" @click="back(index,item)">
                      <el-link :type="index==ctx.ui.knowledge.nva.length-1?'default':'primary'">
                        {{ item.entity.fileName }}
                      </el-link>
                    </q-breadcrumbs-el>
                  </q-breadcrumbs>
                </div>
              </ScrollX>
            </div>
            <div class="row">
              <q-btn dense flat icon="jimu-tianjiawenjianjia"/>
              <q-btn dense flat icon="jimu-tianjiawenjian"/>
            </div>
          </div>
          <div class="full-width column" style="flex-grow: 1">
            <transition enter-active-class="animate__animated animate__bounceIn">
              <q-scroll-area class="fit" :visible="false">
                <draggable :list="ctx.ui.knowledge.files"
                           animation="100"
                           style="flex-wrap: nowrap"
                >
                  <template #item="{element}">
                    <FileUI :info="element"/>
                  </template>
                </draggable>
              </q-scroll-area>
            </transition>
          </div>
        </div>

      </div>
    </q-menu>
  </div>
</template>
<script setup lang="ts">
import ScrollX from "@/components/tool-components/chatGptTool/chat/editor/widget/ScrollX.vue";
import {onMounted, ref} from "vue";
import {getFiles} from "@/components/tool-components/chatGptTool/chatRequest";
import {useGptStore} from "@/components/tool-components/chatGptTool/chat/store/gpt";
import {Tree} from "@/components/system-components/model/system";
import {KnowledgeFile} from "@/components/tool-components/chatGptTool/chat/model/model";
import draggable from 'vuedraggable'

const ctx = useGptStore()
const pid = ref('')

function back(index: number, data: Tree<KnowledgeFile>) {
  // 最后一个数据不处理
  if (index === ctx.ui.knowledge.nva.length - 1) {
    return;
  }
  // 查看根数据
  if (index === 0) {
    ctx.ui.knowledge.nva = [{
      entity: {
        fileName: 'root'
      }
    }]
    getFiles('').then(res => {
      ctx.ui.knowledge.files = res
    })
    return
  }
  ctx.ui.knowledge.files = ctx.ui.knowledge.nva[index].children
  // 计算 当前所有后面有几个元素
  let count = ctx.ui.knowledge.nva.length - 1 - index
  console.log(ctx.ui.knowledge.nva.length, index, count)
  ctx.ui.knowledge.nva.splice(index + 1, count)
}

onMounted(() => {
  getFiles('').then(res => {
    ctx.ui.knowledge.files = res
    ctx.ui.knowledge.nva = [{
      entity: {
        fileName: 'root'
      }
    }]
  })
})
</script>


<style scoped>

</style>
<style>
#knowledge-menu .q-breadcrumbs .flex.items-center.justify-start {
  flex-wrap: nowrap !important;
}

</style>