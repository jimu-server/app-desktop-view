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
import {LoginOut, UpdateAuthEvent, UpdateAuthWindowEvent, UserLogout} from "@/plugins/evenKey";
import {desktop_logout, desktop_open_dev} from "@/components/system-components/desktop/desktop";
import {useWindowsStore} from "@/store/windows";
import {useRouter} from "vue-router";
import {usePlatformStore} from "@/store/platform";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import {homePath} from "@/variable";
import { v4 as uuidv4 } from "uuid";

const app = useAppStore()
const user = userStore()
const tool = useToolStore()
const auth = useAuthStore()
const theme = useThemeStore()
const router = useRouter()
const win = useWindowsStore()
const platform = usePlatformStore()
const gpt = useGptStore()
const $q = useQuasar()

ipcRenderer.on('win-change', (event, arg) => {
  setTimeout(() => {
    let byId = document.getElementById("page-view");
    if (byId) {
      let h = byId.style.minHeight.substring(0, byId.style.minHeight.length - 2);
      app.ui.page.height = parseInt(h)
    }
  }, 100)
})

window.onresize = function () {
  let byId = document.getElementById("page-view");
  if (byId) {
    let h = byId.style.minHeight.substring(0, byId.style.minHeight.length - 2);
    app.ui.page.height = parseInt(h)
  }
}

/*
* @description 登录成功后触发路由跳转,使用事件通知是为了优化用户体验效果
* */
ipcRenderer.on('home', async (event, arg) => {
  await router.push(homePath)
})

/*
* @description 退出登录触发,使用事件通知是为了优化用户体验效果
* */
ipcRenderer.on('login', async (event, arg) => {
  await router.push('/login')
})


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
  tool.init(await getUserAuthTool())
  await tool.UpdateToolRoute()
  // todo 加载用户当前组织当前角色的所有前端路由权限列表
  auth.auth = await getUserAllRoute(user.info.org.id, user.info.role.id)
  // todo 触发窗口权限更新
  emitter.emit(UpdateAuthWindowEvent)
}

async function UserLogoutEvent() {
  // 清空用户信息
  user.clear()
  // 清空窗口导航
  win.clear()
  // 清空tool信息
  tool.clear()
  // 清空会话消息
  gpt.clear()
  // 清空缓存
  localStorage.clear()
  sessionStorage.clear()
  if (platform.isDesktop()) {
    desktop_logout()
  }
  // // 回到登陆页面
  // await router.push('/login')
}

onMounted(() => {
  // 屏蔽 浏览器菜单
  window.oncontextmenu = (event) => {
    event.preventDefault()
    return false;
  }
  let byId = document.getElementById("page-view");
  if (byId) {
    let h = byId.style.minHeight.substring(0, byId.style.minHeight.length - 2);
    app.ui.page.height = parseInt(h)
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

  const uniqueId = uuidv4();
  console.log(uniqueId);

})

// 切换组织 角色 触发更新权限
emitter.on(UpdateAuthEvent, UpdateAuth)
emitter.on(UserLogout, UserLogoutEvent)
onUnmounted(() => {
  emitter.off(UpdateAuthEvent, UpdateAuth)
  emitter.off(UserLogout, UserLogoutEvent)
})

</script>
<style></style>
