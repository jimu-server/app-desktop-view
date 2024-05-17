import {defineStore} from "pinia";

export const useFlowStore = defineStore('flow', {
    state: () => {
        return {
            data: [],
        }
    },
    persist: true,
    getters: {},
    actions: {}
})