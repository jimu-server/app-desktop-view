import {defineStore} from "pinia";
import {ipcRenderer} from "electron";
/*
* @description 存储 electron 渲染进程间通讯的共享变量操作 (窗口之间的参数传递)
* */
export const useElectronStore = defineStore('electron', {
    state: () => {
        return {}
    },
    actions: {
        // 获取用户桌面目录
        async getDesktopPath() {
            return await ipcRenderer.invoke('getDesktopPath')
        },
        // 获取用户桌面目录
        getChildPath(value: string) {
            return ipcRenderer.invoke('getChildPath', value)
        },
        // 获取用户桌面目录
        getUserDataPath() {
            return ipcRenderer.sendSync('getUserDataPath')
        },
        // 获取用户桌面目录
        getDownloadsPath() {
            return ipcRenderer.sendSync('getDownloadsPath')
        },
        // 获取用户桌面目录
    }
})
