import {ElNotification} from "element-plus";
import {Records} from "@/components/system-components/model/system";
import {NotifyMsgType} from "@/components/system-components/model/menu";
import {h, render} from "vue";
import CodeBlockBox from "@/components/tool-components/chatGptTool/chat/mdPlugin/CodeBlockBox.vue";
import {a} from "vite/dist/node/types.d-aGj9QkWt";
import LoginNotifyBody from "@/components/system-components/tool/notifyTool/notifyBody/LoginNotifyBody.vue";
import {modules} from "@/route";
import DefaultNotifyBody from "@/components/system-components/tool/notifyTool/notifyBody/DefaultNotifyBody.vue";


export function notifyMsg(records: Records) {

    let body = ''
    let title = records.title
    let type = 'info'
    switch (records.msgType) {
        case NotifyMsgType.Error:
            type = 'error'
            break
        case NotifyMsgType.Info:
            type = 'info'
            break
        case NotifyMsgType.Success:
            type = 'success'
            break
        case NotifyMsgType.Warning:
            type = 'warning'
            break
    }
    let vNode = null;
    switch (records.template) {
        case 'LoginNotifyBody':
            vNode = h(LoginNotifyBody, {data: records.param})
            break
        default:
            vNode = h(DefaultNotifyBody, {data: records.param})
            break
    }
    let htmlDivElement = document.createElement("dev")
    render(vNode, htmlDivElement);
    if (htmlDivElement.firstChild) {
        body = ((htmlDivElement.firstChild) as HTMLElement).outerHTML
    }
    console.log(body)
    ElNotification({
        title: title,
        message: body,
        dangerouslyUseHTMLString: true,
        type: type,
        position: 'bottom-right',
        showClose: true,
    })
}