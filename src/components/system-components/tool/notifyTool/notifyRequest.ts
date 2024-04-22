
import axiosForServer from "@/plugins/axiosForServer";
import {Records} from "@/components/system-components/model/system";


export function getAllNotify() {
    return new Promise<Records[]>(resolve => {
        axiosForServer.get('/api/notify/pull')
            .then(({data}) => {
                if (data.code !== 200) {
                    resolve([])
                    return
                }
                if (data.data == null) {
                    resolve([])
                    return;
                }
                resolve(data.data)
            })
    })
}