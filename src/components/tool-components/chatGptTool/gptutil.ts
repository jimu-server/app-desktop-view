import {GetHeaders} from "@/plugins/axiosutil";
import pinia from "@/pinia";
import emitter from "@/plugins/event";
import {SendActionScroll} from "@/plugins/evenKey";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import {send} from "@/components/tool-components/chatGptTool/chatRequest";
import {AppChatMessageItem} from "@/components/tool-components/chatGptTool/model/model";
import {genStream} from "@/components/tool-components/chatGptTool/ollamaRequest";
import {useAppStore} from "@/store/app";
import {userStore} from "@/store/user";
import {VITE_APP_OLLAMA_SERVER} from "@/env";
import {getUuid} from "@/utils/systemutils";






export async function SendTextMessage(recoverMessageId: string, text: string) {
    // 获取当前连天选择模型
    let store = useGptStore(pinia);
    let user = userStore(pinia).info
    let model = store.ui.currentModel
    let conversationId = ""
    if (!store.CurrentChat.Current) {
        console.error("conversationId is null")
        return
    }
    conversationId = store.CurrentChat.Current.Conversation.id
    // 创建问题消息
    send(conversationId, recoverMessageId, text, model.model, user.user.picture).then(async result => {
        if (result.code === 200) {
            store.CurrentChat.messageList.push(result.data)
            // 新消息要追加到可显示列表中
            store.newView.push(result.data.id)
            emitter.emit(SendActionScroll)
            // 问题消息发送成功 ,开始获取流是回答
            await getReply(result.data)
        }
    })
}

/*
* @description 对指定消息的回答进行重试操作
* @param {conversationId} 会话id
* @param {messageId} 重试回复消息id
* */
export async function retryMessage(message: AppChatMessageItem) {
    return await getReply(message)
}


async function getReply(message: AppChatMessageItem) {
    // 获取当前连天选择模型
    let store = useGptStore(pinia);
    let model = store.ui.currentModel
    let conversationId = ""
    if (!store.CurrentChat.Current) {
        console.error("conversationId is null")
        return false
    }
    conversationId = store.CurrentChat.Current.Conversation.id
    // 通过问题消息获取流是回答
    //创建 一个gpt回答消息
    let uuid = getUuid()

    // 创建一个消息用户传递 用户的问题输入 ,结束后把这个消息转化为gpt角色 并重置 content 和 role
    let msg: AppChatMessageItem = {
        id: uuid,
        content: message.content,
        conversationID: conversationId,
        messageId: message.id,
        createTime: "",
        role: "user",
        modelId: model.model,
        picture: "",
    }

    let messages = []
    // 检查是否开启上下文聊天
    if (store.ui.autoHistory) messages.push(...store.CurrentChat.messageList)
    messages.push(msg)

    // 请求流数据参数
    let data = {
        conversationId: conversationId,
        id: uuid,
        messageId: message.id,
        model: model.model,
        modelId: model.model,
        messages: messages
    }
    let serverUrl = getOllamaServer()
    msg.stream = await genStream(`${serverUrl}/api/chat/conversation`, data);
    // 清空内容,表示表示后面接收到流消息 判断 content 为 '' 就开始打印消息
    msg.content = ''
    msg.role = 'assistant'
    // 把消息添加到本地缓存
    store.CurrentChat.messageList.push(msg)
    // 新消息要追加到可显示列表中
    store.newView.push(uuid)
    return true
}



/*
* @description 获取 本地gpt服务器地址
* */
export function getOllamaServer() {
    let server: string = VITE_APP_OLLAMA_SERVER
    if (server.endsWith("/")) {
        return server.substring(0, server.length - 1)
    }
    // 使用用户的主机信息
    return server
}


