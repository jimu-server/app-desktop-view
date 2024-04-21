import {RouteRecordRaw} from "vue-router";

export namespace type {
    export class FileNode {
        file: File
        children: FileNode[] // 子文件
    }

    // 具体文件内容属性
    export class File {
        public fileId: number  // 文件id
        public fileName: string// 文件名
        public fileType: number// 文件类型
        public filePath: string// 文件路径,一般都是当前所在目录
        public updateTime: string// 更新时间
        public fileSize: number // 文件大小
    }

    // 动态路由缓存类型
    export class RouterCache {
        root: string
        obj: RouteRecordRaw
    }

    export class Tool {
        id: number
        // 工具图标
        icon: string
        // 工具栏打开标识符
        isOpen: boolean
        // 需要展示的组件名称
        component: string

        name: string
        // path 是管理系统组件的根路由,管理系统内的
        path: string
        // 提示语
        tip: string
        // 工具栏对应的 状态管理器
        msgFun: Function
    }


    export class WindowLabel {
        public path: string
        public title: string
        public windowType: number
        public check: boolean

        constructor(path: string, title: string, type: number, check: boolean) {
            this.path = path
            this.title = title
            this.windowType = type
            this.check = check
        }
    }

    export class Account {

    }

}