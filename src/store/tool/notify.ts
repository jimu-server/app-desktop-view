import {defineStore} from "pinia";
import {Records} from "@/model/menu";


export const useNotifyStore = defineStore('notify', {
    state: () => {
        return {
            list: [] as Records[]
        }
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'notify',
                storage: localStorage,
            },
        ],
    },
    getters: {},
    actions: {}
})