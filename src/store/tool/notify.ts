import {defineStore} from "pinia";
import {Records} from "@/components/system-components/model/menu";


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