<template>
  <Transition class="animate__animated animate__zoomIn">
    <div class="label-body column" @mousemove="showClose" @mouseleave="hideClose">
      <div class="fit justify-between" style="display: flex">
        <div class="row ellipsis" style="padding-left: 5px">
          <div class="column justify-center" @click.stop="OpenWindow">
            <q-icon style="margin-left: 5px" :name="win.icon"/>
          </div>
          <div class="label-title column justify-center ellipsis" @click.stop="OpenWindow">
            <div class="ellipsis" style="margin-left: 5px;user-select: none;max-width: 120px">
              {{ win.title }}
            </div>
          </div>
        </div>
        <div class="column justify-center" style="width: 25px;padding-right: 5px">
          <q-btn v-if="showCloseFlag" size="sm" dense flat icon="jimu-guanbi-2" @click.stop="CloseWindow"
                 :text-color="'red'"
          />
        </div>
      </div>
      <transition
          enter-active-class="animate__animated animate__bounceIn"
      >
        <div v-if="props.win.check" class="active"></div>
      </transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {useWindowsStore} from "@/store/windows";
import {useThemeStore} from "@/store/theme";
import {colors, useQuasar} from "quasar";
import {WindowLabel} from "@/components/system-components/model/system";


const {getPaletteColor} = colors
const windowLabel = useWindowsStore()
const router = useRouter()
const theme = useThemeStore()

const props = defineProps<{
  win: WindowLabel,
  index: number
}>()


// 标签 背景色
const label_bg_color = ref('white')
const label_text_color = ref('black')

// 标签 活跃背景色
const label_active_bg_color = ref()

// 标签 覆盖颜色
const label_bg_color_hover = ref()

const btn_hover_color = ref('black')

const showCloseFlag = ref(props.win.check)

const $q = useQuasar()

if (theme.dark) {
  // label_bg_color.value = 'black'
  // label_text_color.value = 'white'
}


function OpenWindow() {
  router.push(props.win.path!)
  windowLabel.openWindow(props.win.path!, props.index)
}

function CloseWindow() {
  windowLabel.closeWindow(props.win.check!, props.index)
}

function showClose(event) {
  showCloseFlag.value = true
}

function hideClose(event) {
  if (!props.win.check) {
    showCloseFlag.value = false
  }
}

function generateRandomColor() {
  var randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return "#" + randomColor;
}

const WindowTagIcon = new Map<number, string>();
WindowTagIcon[0] = 'jimu-chuangkouzuidahua'
WindowTagIcon[1] = 'jimu-ChatGPT'
const icon = ref()


/*
* @description 监听每次的状态变化,否则会有更新不及时的地方
* */
watch(() => props.win.check, (val) => {
  showCloseFlag.value = val
})


onMounted(() => {
})

</script>

<style scoped>
.label-body {
  position: relative;
  border-style: none;
  min-width: 120px;
  height: 39px;
  cursor: default;
  user-select: none;
  -webkit-app-region: no-drag;
  /*  border-bottom: rgba(140, 147, 157, 0.34) 1px solid;*/
}

.label-title {
  font-size: 12px;
}

.active {
  position: absolute;
  width: 99%;
  top: 5px;
  border-style: solid;
  border-width: 1px;
  height: 30px;
  pointer-events: none;
  border-radius: 2px;
}

</style>