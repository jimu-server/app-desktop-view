<template>
  <q-layout view="lHr lpR fFf">
    <q-header
        :class="theme.header.className"
        style="-webkit-app-region: drag;"
    >
      <slot name="header">
        <q-bar class="bg-transparent row"
               :style="{
            padding:0,
            borderBottom:widowsLabel.windowLabels.length <= 0 ?'none':'rgba(140,147,157,0.34) 1px solid',
            height:'40px'
          }">
          <!--  侧边栏隐藏后的展开按钮   -->
          <q-btn dense flat :icon="!leftDrawerOpen?'jimu-arrow-double-right':'jimu-arrow-double-left'"
                 @click.stop="toggleLeftDrawer" style="margin-left: 5px;margin-right: 5px;-webkit-app-region: no-drag;"
          />
          <window-scroll v-show="widowsLabel.windowLabels.length !== 0"/>
          <q-space/>
          <WindowThemeBtn/>
          <WindowMinimizeBtn/>
          <WindowToggleBtn/>
          <WindowCloseBtn2/>
        </q-bar>
      </slot>
    </q-header>
    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" behavior="desktop" bordered :width=" tool.left.width"
              class="app-drawer" style="-webkit-app-region: drag;">
      <MainWindowTool :position="ToolLayout.Left" :tool-ctx="tool.left.ctx" style="-webkit-app-region: drag;">
        <div class="row justify-center drawer-opt">
          <UserAvatar style="-webkit-app-region: no-drag;"/>
        </div>
        <template v-slot:top="scope">
          <template v-for="item in tool.left.buttons">
            <component :is="item.btn" class="tool-btn" :btn="item" :position="scope.position"
                       style="-webkit-app-region: no-drag;"/>
          </template>
        </template>
        <template v-slot:bottom>
          <q-btn dense flat :ripple="false" icon="jimu-caidan2" style="-webkit-app-region: no-drag;">
            <q-menu
                anchor="top right" self="top left" fit
                transition-show="scale"
                transition-hide="scale"
                :offset="[13,0]"
            >
              <q-list dense>
                <menu-item icon="jimu-shezhi-2" text="设置" @click="showSettingDialog=true"/>
                <menu-item icon="jimu-banbengengxin" text="检查更新"/>
                <menu-item icon="jimu-guanyu" text="关于" @click="showAboutDialog=true"/>
                <menu-item icon="jimu-zhuxiao" text="退出账号" @click="logout"/>
              </q-list>
            </q-menu>
          </q-btn>
        </template>
      </MainWindowTool>
    </q-drawer>
    <!--  聊天窗口 目标的信息窗口,单聊显示 好友信息及其好友设置,群聊则显示群信息和群设置  -->
    <q-drawer id="r-d" v-if="tool.right.buttons.length>0" show-if-above side="right" :width="tool.right.width"
              behavior="desktop"
              bordered
              style="min-width: 52px"
    >
      <MainWindowTool :position="ToolLayout.Right" :tool-ctx="tool.right.ctx">
        <template v-slot:top="scope">
          <template v-for="item in tool.right.buttons">
            <!--      在按钮之间添加上间距处理消息数量展示            -->
            <div style="margin-top: 5px">
              <component :is="item.btn" class="tool-btn" :btn="item" :position="scope.position"/>
            </div>
          </template>
        </template>
      </MainWindowTool>
    </q-drawer>

    <!--  主视图  -->
    <q-page-container class="column justify-center" v-size="sizeChange">
      <Transition enter-active-class="animate__animated animate__fadeInLeft"
                  leave-active-class="animate__animated animate__fadeOutRight">
        <!--   添加路由组件状态管理     -->
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component"/>
          </keep-alive>
        </router-view>
      </Transition>
    </q-page-container>
    <AboutDialog v-model="showAboutDialog"/>
    <SettingDialog v-model="showSettingDialog"/>
  </q-layout>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue'
import {useQuasar} from "quasar";
import {useWindowsStore} from "@/components/system-components/store/windows";

import {useRouter} from "vue-router";
import {useThemeStore} from "@/components/system-components/store/theme";
import {GlobalNotification, UserLogout} from "@/plugins/evenKey";
import emitter from "@/plugins/event";
import WindowScroll from "@/components/system-components/window/tag/WindowScroll.vue";
import {useToolStore} from "@/components/system-components/store/tool";
import {userStore} from "@/components/system-components/store/user";
import MainWindowTool from "@/components/system-components/layouts/tool/MainWindowTool.vue";
import UserAvatar from "@/components/system-components/avatar/UserAvatar.vue";
import DefaultBtn from "@/components/system-components/tool/btn/DefaultBtn.vue";
import {ToolLayout} from "@/components/system-components/model/enum";
import WindowCloseBtn from "@/components/system-components/desktop/WindowCloseBtn.vue";
import WindowMinimizeBtn from "@/components/system-components/desktop/WindowMinimizeBtn.vue";
import {
  desktop_login,
  desktop_logout,
  desktop_max,
  desktop_minimize, desktop_theme_change, desktop_toggle
} from "@/components/system-components/desktop/desktop";
import MenuItem from "@/components/system-components/widget/MenuItem.vue";
import AboutDialog from "@/components/system-components/other/AboutDialog.vue";
import SettingDialog from "@/components/system-components/setting/SettingDialog.vue";
import WindowThemeBtn from "@/components/system-components/desktop/WindowThemeBtn.vue";
import WindowCloseBtn2 from "@/components/system-components/desktop/WindowCloseBtn2.vue";
import WindowToggleBtn from "@/components/system-components/desktop/WindowToggleBtn.vue";
import {useAppStore} from "@/components/system-components/store/app";
import {loadUserInfo} from "@/components/system-components/utils/userutil";


const widowsLabel = useWindowsStore()
const user = userStore()
const tool = useToolStore()
const router = useRouter()
const $q = useQuasar()
const leftDrawerOpen = ref(false)
const showAboutDialog = ref(false)
const showSettingDialog = ref(false)
const mini = ref(false)
const app = useAppStore()
const theme = useThemeStore()


function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const vSize = {
  updated(el, binding, vnode, prevVnode) {
    if (typeof binding.value === 'function') {
      binding.value(el.clientWidth, el.clientHeight);
    }
  },
}

function sizeChange(width: number, height: number) {
  let byId = document.getElementById("page-view");
  if (byId) {
    let h = byId.style.minHeight.substring(0, byId.style.minHeight.length - 2);
    app.ui.page.height = parseInt(h)
  }
}

async function logout() {
  setTimeout(async () => {
    emitter.emit(UserLogout)
  }, 100)
}

onMounted(async () => {
  await loadUserInfo()
})
onUnmounted(async () => {

})

</script>

<style scoped>
.app-windows {
  width: 100%;
  height: 100%;
}

.userinfo:hover {
  cursor: default;
}

.drawer-opt {
  margin-top: 5px;
}

#suspension-menu {
  position: fixed;
  top: 300px;
  left: 0;
  width: 70px;
  height: 100px;
  background: #dddddf;
}


</style>

<style>
.app-drawer {
  overflow: hidden;
  background: rgba(241, 241, 241, 0);
  min-width: 57px;
}
</style>