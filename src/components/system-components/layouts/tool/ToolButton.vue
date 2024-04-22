<template>
  <div class="row justify-center drawer-opt">
    <q-btn dense flat :icon="btn.icon" @click="action">
      <q-tooltip anchor="center end" self="center start">
        {{ btn.tip }}
      </q-tooltip>
      <slot name="notify-badge"></slot>
    </q-btn>
    <ToolNotify :btn="btn" @receive="receive"/>
  </div>
</template>

<script setup lang="ts">
import {Tool, WindowLabel} from "@/components/system-components/model/system";
import router from "@/route";
import {useWindowsStore} from "@/store/windows";

import {useToolStore} from "@/store/tool";
import {userStore} from "@/store/user";
import {ToolBtnType, ToolLayout} from "@/components/system-components/model/menu";

const props = defineProps<{
  btn: Tool
  position: number
}>()

const emits = defineEmits({
  receive: function (data) {

  }
})


const user = userStore()
const tool = useToolStore()
const widowsLabel = useWindowsStore()

function action() {
  switch (props.btn.type) {
    case ToolBtnType.ToolRouteBtn:
      addWindows(props.btn.path, props.btn.name, props.btn.icon)
      break
    case ToolBtnType.ToolWindowBtn:
      switch (props.btn.position) {
        case ToolLayout.Left:
          tool.OpenToolWindow(tool.left, props.btn)
          break
        case ToolLayout.Right:
          tool.OpenToolWindow(tool.right, props.btn)
          break
      }
      break
  }
}

function addWindows(path: string, title: string, icon: string = '') {
  let win = new WindowLabel(path, title, icon, true)
  widowsLabel.UpdateWindow(win)
  router.push(path)
}


function receive(data) {
  emits('receive', data)
}
</script>

<style scoped>

</style>