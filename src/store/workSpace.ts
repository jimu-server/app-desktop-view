import {defineStore} from "pinia";
import {useThemeStore} from "./theme";

export const useWorkSpaceStore = defineStore('space', {
    state: () => {
        return {
            // 左工具栏 开关
            leftShow: false,
            // bak
            width: 300,
            maxWidth: 600,
            minwidth: 5,
            // 当前 左工具窗口上下文数据，存储工具栏按钮实例
            ctx: {},
            buttons: [
                {
                    id: 1,
                    // 工具图标
                    icon: 'Menu',
                    // 工具栏打开标识符
                    isOpen: false,
                    // 需要展示的组件名称
                    component: 'MenuToolWindow',
                    name: 'menu',
                    path: '/index/menu',
                    // 提示语
                    tip: '菜单',
                    msgFun: () => {
                    }
                },
                /* {
                     id: 2,
                     // 工具图标
                     icon: 'ToolWindowProjectIcon',
                     // 工具栏打开标识符
                     isOpen: false,
                     // 需要展示的组件名称
                     component: 'FilesToolWindow',
                     // basePath 只能是登录的 index ，根据情况切换，一般不变
                     basePath: 'index',
                     name: 'files',
                     // path 不能重复
                     path: '/index/files',
                     // 提示语
                     tip: '文件管理',
                     msgFun:()=>{}
                 }*/
            ]
        }
    },
    getters: {},
    actions: {
        // 设置 工具栏的显示或者关闭
        // 更新工具栏按钮打开状态
        // index index索引处的工具保持打开状态，其余状态关闭
        UpdateShowStatus(index: number, flag: boolean) {
            let arr = this.buttons
            for (let i = 0; i < arr.length; i++) {
                if (i === index) {
                    arr[i].isOpen = flag
                } else {
                    arr[i].isOpen = false
                }
            }
            this.buttons = arr
            this.ctx = arr[index]
        }
    }
})