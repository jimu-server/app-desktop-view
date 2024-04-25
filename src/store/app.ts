import {defineStore} from "pinia";


export const useAppStore = defineStore('app', {
    state: () => {
        return {
            defaultAvatar: 'https://jimuos-1252940994.cos.ap-nanjing.myqcloud.com/go.jpg',
            dict: {},
            ui: {
                page: {
                    height: ''
                },
            }
        }
    },
    persist: true,
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