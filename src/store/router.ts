import {defineStore} from "pinia";
import Axios from "@/plugins/axiosForServer";
import {Router, Result, RouterCache} from "@/components/system-components/model/system";


export const useRouterStore = defineStore('router', {
    state: () => {
        return {
            // 定义 状态数据
            cache: JSON.parse(sessionStorage.getItem('route_cache') as string) as RouterCache[] || [] as RouterCache[],
            menu_route: MenuToolRoute()
        }
    },
    actions: {
        AddRouteCache(value: RouterCache) {
            let index = -1
            // 缓存中存在数据 则跳过
            index = this.cache.findIndex(item => {
                return item.root === value.root && item.path === value.path
            })
            if (index !== -1) {
                return
            }
            this.cache.push(value)
            // 缓存
            sessionStorage.setItem("route_cache", JSON.stringify(this.cache))
        },
    }
})


export async function MenuToolRoute() {
    return await getMenuRoute()
}

function getMenuRoute() {
    return new Promise<Router[]>(resolve => {
        Axios.get('/menu').then(response => {
            let data: Result<Router[]> = response.data
            if (data.code === 200) {
                resolve(data.data)
            } else {
                resolve([])
            }
        }).catch(error => {
            resolve([])
        })
    })
}