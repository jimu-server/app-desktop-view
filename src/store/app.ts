import {defineStore} from "pinia";


export const useAppStore = defineStore('app', {
    state: () => {
        return {
            defaultAvatar: 'https://jimuos-1252940994.cos.ap-nanjing.myqcloud.com/go.jpg',
            dict: {},
            ui: {
                // 窗口属性
                window: {
                    width: 0,
                    height: 0
                },
                page: {
                    height: ''
                },
            }
        }
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'app',
                storage: localStorage
            }
        ]
    },
    getters: {},
    actions: {

        /*
        * @description: 获取字典数据
        * @param {type} 字典数据类型模块
        * @param {value} 字典数据值
        * @return: 字典数据对应展示
        * */
        get(type: string, value: number): string {
            let list = this.dict[type]
            for (const element of list) {
                if (element.status == value) {
                    return element.name
                }
            }
            return ''
        }
    }
})