import {userStore} from "@/store/user";
import pinia from "@/pinia";


export function GetHeaders(): any {
    let token: string = GetToken()
    let header: any = {}

    // 添加 token 头
    if (token !== '') {
        header.Authorization = token
    }
    return header
}

export function GetToken(): string {
    let token: string = ''
    let store = userStore(pinia);
    let t = store.info.token
    if (t !== '') {
        token = 'Bearer ' + t
    }
    return token
}
