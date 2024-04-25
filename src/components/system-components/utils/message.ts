/*
* @ description 发送存文本消息
* */
import {useGptStore} from "@/components/system-components/chat/store/chat_ctx";
import {sys} from "@/components/system-components/model/system";
import {MessageItem} from "@/components/system-components/chat/model/chat";



async function send(data: MessageItem) {

}


function base64ToFile(dataurl, name) {
    var arr = dataurl.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], name, {
        type: mime,
    })
}