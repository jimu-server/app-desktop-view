<template>
  <q-item class="row justify-between" dense style="padding: 0;height: 40px;">
    <div class="row full-width">
      <div class="row plugin-item full-width" @click="check" @mouseenter="infoShow = true" @mouseleave="infoOut">
        <div class="column justify-center" style="margin-left: 5px">
          <q-icon :name="plugin.icon"/>
        </div>
        <div class="column justify-center" style="margin-left: 5px">
          {{ plugin.name }}
        </div>
      </div>
    </div>
    <div class="column justify-center" style="margin-right: 5px">
      <q-radio dense v-model="ctx.ui.currentPlugin" :val="plugin"/>
    </div>
    <q-menu
        v-model="infoShow" @mouseenter="into" @mouseleave="popupOut"
        anchor="top end" self="top start"
        persistent
        :offset="[5,0]"
    >
      <q-card class="fit">
        <div style="width: 100px;height: 100px">
          <el-button>
            test
          </el-button>
        </div>
      </q-card>
    </q-menu>
  </q-item>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {AppChatPlugin} from "@/components/tool-components/chatGptTool/model/model";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";


const ctx = useGptStore()
const props = defineProps<{
  plugin: AppChatPlugin;
}>()

const infoShow = ref(false)
const infoShowOut = ref(false)

// 初始化选中状态

if (ctx.ui.currentPlugin){
  if (ctx.ui.currentPlugin.id === props.plugin.id) {
    ctx.ui.currentPlugin = props.plugin
  }
}

// 选中操作
function check() {
  ctx.ui.currentPlugin = props.plugin
}


function into() {
  infoShowOut.value = true
  ctx.ui.pluginMenuShowFlag = true
}

function popupOut() {
  infoShow.value = false
  infoShowOut.value = false
  ctx.ui.pluginMenuShowFlag = false
}

function infoOut() {
  setTimeout(() => {
    if (!infoShowOut.value) {
      infoShow.value = false
    }
  }, 200)
}
</script>


<style scoped>
.plugin-item {
  padding: 5px;
  user-select: none;
}

.plugin-item:hover {

}
</style>