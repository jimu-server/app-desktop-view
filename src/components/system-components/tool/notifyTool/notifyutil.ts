import {deleteNotify, getAllNotify, readNotify} from "@/components/system-components/tool/notifyTool/notifyRequest";
import {useNotifyStore} from "@/store/tool/notify";
import pina from "@/pinia";


export async function readMsg(id: string) {
    let result = await readNotify(id)
    const notify = useNotifyStore(pina)
    if (result.code == 200) {
        notify.list = await getAllNotify()
    }
}

export async function readMsgElNotifyOprion(id: string, callback: () => void) {
    let result = await readNotify(id)
    const notify = useNotifyStore(pina)
    if (result.code == 200) {
        notify.list = await getAllNotify()
    }
    callback()
}


export async function delMsg(id: string) {
    let result = await deleteNotify(id)
    const notify = useNotifyStore(pina)
    if (result.code == 200) {
        notify.list = await getAllNotify()
    }
}