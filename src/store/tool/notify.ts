import {defineStore} from "pinia";
import {Records} from "@/components/system-components/model/system";


export const useNotifyStore = defineStore('notify', {
    state: () => {
        return {
            list: [] as Records[]
        }
    },
    persist: true,
    getters: {},
    actions: {}
})