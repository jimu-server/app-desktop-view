import {defineStore} from "pinia";


export const useAuthStore = defineStore('auth', {
    state: () => {
        return {
            auth: JSON.parse(localStorage.getItem('auth')) as string[] || [] as string[],
        }
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'auth',
                storage: localStorage
            }
        ]
    },
    getters: {},
    actions: {
        // 添加授权路径
        addAuthPath(path: string) {
            if (!this.auth.includes(path)) {
                this.auth.push(path)
            }
        },
        // 清空 授权路径缓存
        clearAuthPath() {
            this.auth = []
        },
    }
})