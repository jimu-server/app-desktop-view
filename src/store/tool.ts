import {defineStore} from "pinia";
import router, {modules} from "@/route";
import {rootPathName} from "@/variable";
import {getUserAuthToolMenu} from "@/components/system-components/request";
import {userStore} from "@/store/user";
import pina from "@/pinia";
import {Router, Tool, Tree} from "@/components/system-components/model/system";

export const useToolStore = defineStore('tool', {
    state: () => {
        return {
            left: {
                width: 53,
                ctx: {} as Tool,
                isOpen: false
            },
            right: {
                width: 53,
                ctx: {} as Tool,
                isOpen: false
            },
            buttons: [] as Tool[],
            buttons_router: {} as Map<string, Tree<Router>[]>
        }
    },
    persist: true,
    getters: {},
    actions: {
        /*
        * @description: 注册工具栏的路由
        * */
        async UpdateToolRoute() {
            // 加载 工具路由
            let store = userStore(pina);
            for (const button of this.buttons) {
                let menus = await getUserAuthToolMenu(store.info.org.id, store.info.role.id, button.id)
                this.buttons_router[button.id] = menus
                // 用与初始化 工具的子路由的 父级路由名称 如果工具本身没有路由 , 子路由的父级路由将是  rootPathName
                let routerName = rootPathName

                // 判断 当前的工具栏受否是路由类型 不是路由类型 就不需要添加路由
                if (button.type == 1) {
                    const component = modules[`./${button.component}.vue`]
                    if (button.path === '' || button.name === '') {
                        continue
                    }
                    router.addRoute(
                        rootPathName,
                        {
                            path: button.path,
                            name: button.routerName,
                            component: component
                        }
                    )
                    routerName = button.routerName
                }
                this.UpdateToolMenuRouter(routerName, menus)
            }
        },
        /*
        * @description: 注册工具栏存在的子路由
        * */
        UpdateToolMenuRouter(parent: string, menus: Tree<Router>[]) {
            for (const menu of menus) {
                const component = modules[`./${menu.entity.component}.vue`]
                if (menu.entity.path !== '' || menu.entity.component !== '') {
                    router.addRoute(
                        parent,
                        {
                            path: menu.entity.path,
                            name: menu.entity.name,
                            component: component
                        }
                    )
                }
                this.UpdateToolMenuRouter(parent, menu.children)
            }
        },

        /*
        * @description 工具栏点击按钮操作,执行对更具蓝窗口视图的更新控制,点击相同的工具栏按钮会触发关闭(即拖拽宽度恢复到初始52状态),切换到其他工具栏按钮则不关闭
        * */
        OpenToolWindow(ctx: any, btn: Tool) {
            if (ctx.ctx == btn) {
                if (ctx.isOpen) {
                    ctx.isOpen = false
                    ctx.width = 52
                    // 清空 侧边栏对于的当前组件上下文
                    ctx.ctx = {}
                    return
                }
            }
            ctx.ctx = btn
            if (!ctx.isOpen) {
                ctx.isOpen = true
                if (ctx.width <= 56) {
                    ctx.width = 300
                }
            }
        }
    },
})