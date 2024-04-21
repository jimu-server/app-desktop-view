import {GetHeaders} from "@/plugins/axiosutil";
import pinia from "@/pinia";
import emitter from "@/plugins/event";
import {SendActionScroll} from "@/plugins/evenKey";
import {useChatCtxStore} from "@/components/tool-components/chatGptTool/chat/store/chat_ctx";
import {getUuid, send} from "@/components/tool-components/chatGptTool/chatRequest";
import {AppChatMessageItem} from "@/components/tool-components/chatGptTool/chat/model/gpt";

let ctxStore = useChatCtxStore(pinia);

export async function SendTextMessage(recoverMessageId: string, text: string) {
    // 获取当前连天选择模型
    let store = useChatCtxStore(pinia);
    let model = store.ui.currentModel
    let conversationId = ""
    if (!store.CurrentChat.Current) {
        console.error("conversationId is null")
        return
    }
    conversationId = store.CurrentChat.Current.Conversation.id
    // 创建问题消息
    send(conversationId, recoverMessageId,text, model.id).then(async result => {
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
    let store = useChatCtxStore(pinia);
    let model = store.ui.currentModel
    let conversationId = ""
    if (!store.CurrentChat.Current) {
        console.error("conversationId is null")
        return false
    }
    conversationId = store.CurrentChat.Current.Conversation.id
    // 通过问题消息获取流是回答
    //创建 一个gpt回答消息
    let uuid = await getUuid()

    // 创建一个消息用户传递 用户的问题输入 ,结束后把这个消息转化为gpt角色 并重置 content 和 role
    let msg: AppChatMessageItem = {
        id: uuid,
        content: message.content,
        conversationID: conversationId,
        messageId: message.id,
        createTime: "",
        role: "user",
        modelId: model.id,
        picture: model.picture,
    }

    let messages = []
    // 检查是否开启上下文聊天
    if (ctxStore.ui.autoHistory) messages.push(...ctxStore.CurrentChat.messageList)
    messages.push(msg)

    // 请求流数据参数
    let data = {
        conversationId: conversationId,
        id: uuid,
        messageId: message.id,
        model: model.model,
        modelId: model.id,
        messages: messages
    }
    msg.stream = await genStream('http://localhost:8080/api/chat/conversation', data);
    // 清空内容,表示表示后面接收到流消息 判断 content 为 '' 就开始打印消息
    msg.content = ''
    msg.role = 'assistant'
    // 把消息添加到本地缓存
    store.CurrentChat.messageList.push(msg)
    // 新消息要追加到可显示列表中
    store.newView.push(uuid)
    return true
}

async function genStream(url: string, data: any) {
    // tip 此处的 response 不能 clone 返回,会无法清空取消持续读取
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...GetHeaders()
        },
        body: JSON.stringify(data),
    });
    return response;
}


