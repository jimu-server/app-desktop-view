import {createRouter, createWebHashHistory, Router, RouteRecordRaw} from "vue-router";
import {homePath, homePathName, rootPath, rootPathName} from "@/variable";
import {useRouterStore} from "@/store/router";
import pinia from "@/pinia";
import NotFound from "@/components/system-components/NotFound.vue";
import {useToolStore} from "@/store/tool";
import {userStore} from "@/store/user";
import {set} from "lodash";
import {usePlatformStore} from "@/store/platform";


const routes: RouteRecordRaw[] = []

// 加载所有组件 用于动态路由注册路由
export const modules = import.meta.glob('./components/**/*.vue')
const router: Router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from) => {

    return true
})

// 初始化 adman 基础路由
let registerMenuRoute = true
router.beforeEach(async (to, from, next) => {
    // let menus = useRouterStore(pinia).menu_route
    if (registerMenuRoute) {
        let platform = usePlatformStore(pinia);
        // 初始化登录路由
        router.addRoute({
            path: '/',
            name: 'public',
            component: () => import('@/components/system-components/PublicPage.vue')
        })
        router.addRoute({
            path: '/login',
            name: 'login',
            component: () => import('@/components/system-components/Login.vue')
        })
        router.addRoute({
            path: '/verify/:value',
            name: 'verify',
            component: () => import('@/components/system-components/EmailVerify.vue'),
            props: true
        })
        router.addRoute({
            path: '/tray',
            name: 'tray',
            component: () => import('@/components/system-components/desktop/TrayMenu.vue')
        },)
        // 初始化 管理系统父路由
        router.addRoute({
            path: rootPath,
            name: rootPathName,
            component: () => import('@/components/system-components/layouts/MainWindow.vue'),
            children: [
                {
                    path: homePath,
                    name: homePathName,
                    component: () => import('@/components/system-components/pages/HomePage.vue'),
                },
                {
                    path: '/' + rootPathName + ':afterUser(.*)',
                    component: NotFound
                },
            ]
        })

        // 加载 缓存路由
        let cache = useRouterStore(pinia).cache
        cache.forEach(element => {
            if (element.path === '') {
                return
            }
            const component = modules[`./${element.component}.vue`]
            router.addRoute(
                element.root,
                {
                    path: element.path,
                    component: component,
                }
            )
        })
        // 初始化加载 tool 路由 未登录状态不用加载
        const user = userStore(pinia)
        if (user.info.token !== '') {
            let tool = useToolStore(pinia)
            await tool.UpdateToolRoute()
        }
        registerMenuRoute = false
        next({path: to.path})
    } else {
        next()
    }
})

router.beforeEach((to, from, next) => {
    if (from.path.startsWith("/verify") && to.path.startsWith(rootPath)) {
        return
    }
    if (to.path.startsWith(rootPath)) {
        let store = userStore(pinia);
        let token = store.info.token;
        if (token === '') {
            next({path: '/login'})
        } else {
            next()
        }
    }
    next()
})
export default router