<template>
  <Transition enter-active-class="animate__animated animate__fadeIn"
              leave-active-class="animate__animated animate__fadeOut">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component"/>
      </keep-alive>
    </router-view>
  </Transition>
</template>
<script lang="ts" setup>
import {onMounted, onUnmounted} from "vue";
import {ipcRenderer} from "electron";
import emitter from "./plugins/event";
import {useQuasar} from "quasar";
import {useThemeStore} from "./store/theme";
import {useAppStore} from "@/store/app";
import {getUserAllRoute, getUserAuthTool} from "@/components/system-components/request";
import {useAuthStore} from "@/store/auth";
import {useToolStore} from "@/store/tool";
import {userStore} from "@/store/user";
import {UpdateAuthEvent, UpdateAuthWindowEvent} from "@/plugins/evenKey";
import {desktop_open_dev} from "@/components/system-components/desktop/desktop";

const app = useAppStore()
const user = userStore()
const tool = useToolStore()
const auth = useAuthStore()
const theme = useThemeStore()
ipcRenderer.on('win-change', (event, arg) => {
  // console.log(ctx.ui.window.width, ctx.ui.window.height)
  setTimeout(() => {
    let byId = document.getElementById("page-view");
    if (byId) {
      app.ui.page.height = byId.style.minHeight
    }
  }, 100)
})

window.onresize = function () {
  let byId = document.getElementById("page-view");
  if (byId) {
    app.ui.page.height = byId.style.minHeight
  }
}


const $q = useQuasar()


$q.iconMapFn = (iconName) => {
  // iconName 是来自 QIcon 中 "name" 属性的值

  // 您的自定义方法，以下只是一个示例：
  if (iconName.startsWith('jimu-') === true) {
    return {
      cls: 'icon iconfont ' + iconName
    }
  }
}


// 主要处理更新权限相关
async function UpdateAuth() {
  // todo 加载用户已授权的工具栏按钮
  tool.buttons = []
  tool.buttons.push(...await getUserAuthTool(user.info.org.id, user.info.role.id, 1))
  tool.buttons.push(...await getUserAuthTool(user.info.org.id, user.info.role.id, 2))
  await tool.UpdateToolRoute()
  // todo 加载用户当前组织当前角色的所有前端路由权限列表
  auth.auth = await getUserAllRoute(user.info.org.id, user.info.role.id)
  // todo 触发窗口权限更新
  emitter.emit(UpdateAuthWindowEvent)
}

onMounted(() => {
  // 屏蔽 浏览器菜单
  window.oncontextmenu = (event) => {
    event.preventDefault()
    return false;
  }
  let byId = document.getElementById("page-view");
  if (byId) {
    app.ui.page.height = byId.style.minHeight
  }
  // 获取当前操作系统的主题
  const match = matchMedia('(prefers-color-scheme: dark)');
  // 设置Quasar的主题
  $q.dark.set(match.matches)
  // 设置app主题
  theme.setTheme(match.matches)
  // 添加变化监听
  match.addEventListener('change', () => {
    $q.dark.set(match.matches)
    theme.setTheme(match.matches)
  })

  window.onkeydown = function (event) {
    if (event.key == "F12") {
      desktop_open_dev()
    }
  }

})

// 切换组织 角色 触发更新权限
emitter.on(UpdateAuthEvent, UpdateAuth)
onUnmounted(() => {
  emitter.off(UpdateAuthEvent, UpdateAuth)
})

</script>
<style></style>
