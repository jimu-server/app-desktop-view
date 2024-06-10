<template>
  <q-item
      class="row justify-between plugin"
      dense
      style="padding: 0;height: 40px;"
      @mouseenter="infoShow = true" @mouseleave="infoOut"

  >
    <div class="row full-width"
         @mouseover="checkColor='white'"
         @mouseleave="checkColor='primary'"
    >
      <div class="row plugin-item full-width" @click.stop="check">
        <div class="column justify-center" style="margin-left: 5px">
          <q-icon :name="plugin.icon"/>
        </div>
        <div class="column justify-center" style="margin-left: 5px">
          {{ plugin.name }}
        </div>
      </div>
    </div>
    <div class="column justify-center" style="margin-right: 5px">
      <q-radio
          ref="radioRef"
          dense
          v-model="ctx.ui.currentPlugin"
          :val="plugin"
          :keep-color="false"
          :color="checkColor"
          @mouseover="checkColor='white'"
          @mouseleave="checkColor='primary'"
      />
    </div>
    <q-menu
        v-model="infoShow" @mouseenter="enterMenu" @mouseleave="leaveMenu"
        anchor="top end" self="top start"
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
import {colors} from 'quasar'

const {getPaletteColor} = colors

const ctx = useGptStore()
const props = defineProps<{
  plugin: AppChatPlugin;
}>()

const infoShow = ref(false)
const infoShowOut = ref(false)
const radioRef = ref(null)
const checkColor = ref('')
// 初始化选中状态

if (ctx.ui.currentPlugin){
  if (ctx.ui.currentPlugin.id === props.plugin.id) {
    ctx.ui.currentPlugin = props.plugin
  }
}

// 选中操作
function check() {
  radioRef.value.set()
}


function enterMenu() {
  infoShowOut.value = true
  ctx.ui.pluginMenuShowFlag = true
}

function leaveMenu() {
  infoShow.value = false
  infoShowOut.value = false
  ctx.ui.pluginMenuShowFlag = false
}

function overColor() {

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

.plugin:hover {
  cursor: pointer;
  background-color: v-bind('getPaletteColor('primary')') !important;
  color: white !important;
}
</style>