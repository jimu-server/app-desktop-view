import {defineStore} from "pinia";
import {ipcRenderer} from "electron";
/*
* @description 存储 electron 渲染进程间通讯的共享变量操作 (窗口之间的参数传递)
* */
export const useElectronStore = defineStore('electron', {
    state: () => {
        return {
            // 主题参数
            dark: JSON.parse(localStorage.getItem("theme")) || false,
            header: {
                className: JSON.parse(localStorage.getItem("className")) || 'bg-transparent text-black',
            },


            // 背景图片
            // 预览消息窗口需要加载的数据 同  previewData
            previewWinData: JSON.parse(localStorage.getItem("preview-message")) || {}
        }
    },
    actions: {

        // 切换 light 主题
        setTheme(flag: boolean) {
            this.dark = flag;
            if (flag) {
                this.header.className = 'bg-transparent text-white';
            } else {
                this.header.className = 'bg-transparent text-black';
            }
            localStorage.setItem('theme', JSON.stringify(this.dark));
            localStorage.setItem('className', this.header.className);
        },

        /*
        * @description: 关闭消息预览对话框
        * */
        ClosePreviewWindow() {
            ipcRenderer.send('close-message-preview')
        },
        /*
        * @description: 最大化消息预览对话框
        * */
        MaxPreviewWindow() {
            ipcRenderer.send('max-message-preview')
        },
        /*
        * @description: 最小化消息预览对话框
        * */
        MinPreviewWindow() {
            ipcRenderer.send('min-message-preview')
        },
        /*
        * @description: 预览上一条信息
        * */
        PerPreviewMessage() {
            if (this.previewWinData.index <= 0) {
                return
            }
            this.previewWinData.index--
            this.previewWinData.message = this.previewWinData.previewMessages[this.previewWinData.index]
        },

        /*
        * @description: 预览下一条信息
        * */
        NextPreviewMessage() {
            if (this.previewWinData.index >= this.previewWinData.previewMessages.length - 1) {
                return
            }
            this.previewWinData.index++
            this.previewWinData.message = this.previewWinData.previewMessages[this.previewWinData.index]
        },


        /*
        * @description: 关闭账号管理器
        * */
        CloseMangeAccountsWindow() {
            ipcRenderer.send('close-manage-accounts-window')
        },

        /*
        * @description: 打开查找窗口
        * */
        OpenSearchWindow() {
            ipcRenderer.send('open-search-window')
        },

        /*
        * @description: 关闭查找窗口
        * */
        CloseSearchWindow() {
            ipcRenderer.send('close-search-window')
        }

    }
})
