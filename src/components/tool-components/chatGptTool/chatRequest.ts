import axiosForServer from "@/plugins/axiosForServer";
import {Result} from "@/components/system-components/model/system";
import {
    AppChatConversationItem,
    AppChatMessageItem,
    LLmMole
} from "@/components/tool-components/chatGptTool/chat/model/gpt";



export function getConversation() {
    return new Promise<AppChatConversationItem[]>(resolve => {
        axiosForServer.get<Result<AppChatConversationItem[]>>('/api/chat/conversation/get').then(({data}) => {
            if (data.code === 200) {
                if (data.data == null) {
                    resolve([])
                    return;
                }
                resolve(data.data)
            }
        })
    })
}

export function createConversation(name: string) {
    return new Promise<Result<string>>(resolve => {
        axiosForServer.post<Result<string>>("/api/chat/conversation/create", {
            title: name
        })
            .then(({data}) => {
                resolve(data)
            })
    })
}


export function delConversation(id: string) {
    return new Promise<Result<any>>(resolve => {
        axiosForServer.post<Result<any>>("/api/chat/conversation/del", {
            Id: id
        })
            .then(({data}) => {
                resolve(data)
            })
    })
}


export function send(conversationId: string, recoverMessageId: string, value: string, modelId: string) {
    return new Promise<Result<AppChatMessageItem>>(resolve => {
        axiosForServer.post<Result<AppChatMessageItem>>("/api/chat/send", {
            conversationId: conversationId,
            content: value,
            modelId: modelId,
            messageId: recoverMessageId,
        })
            .then(({data}) => {
                resolve(data)
            })
    })
}

export function getUuid() {
    return new Promise<string>(resolve => {
        axiosForServer.get<Result<string>>("/api/chat/uuid").then(({data}) => {
            if (data.code === 200) {
                resolve(data.data)
                return
            }
            console.error("uuid获取失败")
            resolve("")
        })
    })
}

export function getConversationMessage(id: string) {
    return new Promise<AppChatMessageItem[]>(resolve => {
        axiosForServer.get<Result<AppChatMessageItem[]>>("/api/chat/conversation/message", {
            params: {
                conversationId: id
            }
        }).then(({data}) => {
            if (data.code === 200) {
                if (data.data == null) {
                    resolve([])
                    return;
                }
                resolve(data.data)
            }
        })
    })
}

export function getMessage(id: string) {
    return new Promise<AppChatMessageItem>(resolve => {
        axiosForServer.get<Result<AppChatMessageItem>>("/api/chat/msg", {
            params: {
                id: id
            }
        }).then(({data}) => {
            if (data.code === 200) {
                if (data.data == null) {
                    resolve(null)
                    return;
                }
                resolve(data.data)
            }
        })
    })
}

export function getLLmMole() {
    return new Promise<LLmMole[]>(resolve => {
        axiosForServer.get<Result<LLmMole[]>>("/api/chat/model/list").then(({data}) => {
            if (data.code === 200) {
                if (data.data == null) {
                    resolve([])
                    return;
                }
                resolve(data.data)
            }
        })
    })
}

