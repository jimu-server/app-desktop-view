import { IMSDK } from "./sdk";
import emitter from "../plugins/event";
import {ScrollMove, SendActionScroll, UpdateConversation} from "../plugins/evenKey";
import { useChatCtxStore } from "../store/chat_ctx";
import { sys } from "../model/system";
import { MessageItem, PicBaseInfo } from "./lib/types/entity";
import { v4 as uuidv4 } from 'uuid';

/*
* @ description 发送存文本消息
* */
export async function SendTextMessage(message: sys.ChatMessageEntity) {
    let ctx = useChatCtxStore()
    if (message.data == "" || message.data == "\n") {
        return
    }

    await IMSDK.createTextMessage(message.data)
        .then(async (data) => {
            // 调用成功
            // console.log(data)
            await send(data.data)
        })
        .catch(({ errCode, errMsg }) => {
            // 调用失败
            console.log("消息创建失败", errCode, errMsg)
        });
}

export async function SendImageMessage(message: sys.ChatMessageEntity) {
    let uuid = uuidv4()
    console.log(message)

    let file = base64ToFile(message.data, "image.png")
    console.log(file)
    let info: PicBaseInfo = {
        height: 0, size: 0, type: "", url: "", uuid: uuid, width: 0
    }
    await IMSDK.createImageMessageByFile({
        sourcePicture: info,
        bigPicture: info,
        snapshotPicture: info,
        sourcePath: "",
        file: file
    }).then(async ({ data }) => {
        // @ts-ignore
        await send(data)
    }).catch(({ errCode, errMsg }) => {
        console.log("图片消息创建失败", errCode, errMsg)
    })
}


async function send(data: MessageItem) {
    let ctx = useChatCtxStore()
    let current = ctx.CurrentChat.Current
    await IMSDK.sendMessage({
        recvID: current.Conversation?.userID!,
        groupID: "",
        message: data
    })
        .then((ok) => {
            // 调用成功  发送成功
            console.log("1.消息发送成功", ok)
            ctx.CurrentChat.messageList.push(ok.data)
            emitter.emit(SendActionScroll)
            emitter.emit(UpdateConversation)
        })
        .catch(({ errCode, errMsg }) => {
            // 调用失败
            console.log("消息发送失败", errCode, errMsg)
        });
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