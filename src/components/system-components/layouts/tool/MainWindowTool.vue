<template>
  <div :class="position==ToolLayout.Left?layout_l:layout_r">
    <ToolSidebar>
      <div class="full-height column">
        <div class="row " style="height: 50%;flex-grow: 1;">
          <div class="fit column">
            <div class="full-width">
              <slot></slot>
            </div>
            <q-scroll-area :visible="false" class="column" style="flex-grow: 1">
              <slot name="top" :position="position">
                <template v-for="item in tool.buttons">
                  <!--      在按钮之间添加上间距处理消息数量展示            -->
                  <div style="margin-top: 5px">
                    <component :is="item.btn" :btn="item" :key="item.id" v-if="item.position==position"
                               :position="position"/>
                  </div>
                </template>
              </slot>
            </q-scroll-area>
          </div>
        </div>
        <div class="column justify-end" style="height: 50%;flex-grow: 1;">
          <div class="row justify-center drawer-opt" style="margin-bottom: 10px;">
            <slot name="bottom">

            </slot>
          </div>
        </div>
      </div>
    </ToolSidebar>
    <template v-if="toolShow">
      <ToolSidebarView :id="position" :toolCtx="toolCtx" :position="position" style="-webkit-app-region: no-drag;"/>
      <!--  在工具窗口打开时才可以拖拽宽度  -->
      <Slide :class="position==ToolLayout.Left?slide_line_l:slide_line_r" @widthChange="widthChange" style="-webkit-app-region: no-drag;"/>
    </template>
  </div>
</template>

<script setup lang="ts">

import ToolSidebarView from "@/components/system-components/layouts/tool/ToolSidebarView.vue";
import ToolSidebar from "@/components/system-components/layouts/tool/ToolSidebar.vue";
import {computed, onMounted, ref, watch} from "vue";
import {useToolStore} from "@/store/tool";
import {userStore} from "@/store/user";
import {Tool} from "@/components/system-components/model/system";
import {ToolLayout} from "@/components/system-components/model/enum";

const tool = useToolStore()
const user = userStore()


const props = defineProps<{
  toolCtx: Tool,
  position: number
}>()

const toolShow = computed(() => {
  switch (props.position) {
    case ToolLayout.Left:
      return tool.left.isOpen
    case ToolLayout.Right:
      return tool.right.isOpen
    default:
      return false
  }
})


let widthChange = null
//'tool fit bg-transparent row justify-lg-between'
let layout_l = ref(['fit', 'bg-transparent', 'row', 'justify-lg-between', 'tool', 'l_tool'])
let layout_r = ref(['fit', 'bg-transparent', 'row', 'justify-lg-between', 'reverse', 'tool', 'r_tool'])

// 处理侧边栏拖拽线的布局
let slide_line_l = ref(['drag', 'absolute-right']) // 左边
let slide_line_r = ref(['drag', 'absolute-left']) // 右边

// 处理侧边栏按钮的布局
let slide_btn_l = ref(['absolute-left'])
let slide_btn_r = ref(['absolute-right'])


switch (props.position) {
  case 1:
    widthChange = leftWidthChange
    break
  case 2:
    widthChange = rightWidthChange
    break
}


function leftWidthChange(movement) {
  let w = document.documentElement.clientWidth / 3
  if (movement < 0 && tool.left.width >= w) {
    return;
  }
  if (movement > 0 && tool.left.width <= tool.baseWidth) {
    return
  }
  tool.left.width -= movement;
}

// 设置分割线拖动修改窗口宽度
function rightWidthChange(movement) {
  let w = document.documentElement.clientWidth / 3

  if (movement > 0 && tool.right.width >= w) {
    return;
  }
  if (movement < 0 && tool.right.width <= tool.baseWidth) {
    return
  }
  tool.right.width += movement;
}


function check(value: Tool): boolean {
  console.log(value)
  if (!value) return false
  return value.position == props.position
}

onMounted(async () => {

})

// 处理拖拽线 卡顿,拖动过快大小超出预设值 重置 侧边栏的宽度
watch(() => tool.left.width, (value) => {
  if (value <= 56) {
    tool.left.width = 56
  }
})
// 处理拖拽线 卡顿,拖动过快大小超出预设值 重置 侧边栏的宽度
watch(() => tool.right.width, (value) => {
  if (value <= 56) {
    tool.right.width = 56
  }
})

</script>


<style scoped>
.tool {
  justify-content: space-between;
  padding-top: 2px;
  padding-bottom: 2px;
  overflow: hidden;
}

</style>