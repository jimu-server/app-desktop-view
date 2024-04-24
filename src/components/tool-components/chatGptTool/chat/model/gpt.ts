import {MessageType} from "@/components/tool-components/chatGptTool/chat/model/chat";


export interface AppChatConversationItem {
    id?: string
    // 会话头像
    picture?: string
    // 会话标题
    title?: string
    // 用户id
    userId?: string
    // 最后一条会话消息的模型
    lastModel?: string
    // 最后一条会话消息
    lastMsg?: string
    // 最后一条会话消息的时间
    lastTime?: string
    // 会话创建时间
    createTime?: string
}

export interface AppChatMessageItem {
    id: string
    // 会话窗口
    conversationID: string
    messageId: string
    // 消息类型
    contentType?: MessageType
    // 用户id or 模型id
    userId?: string
    modelId: string
    // 消息对应头像
    picture?: string
    // 消息角色
    role: string
    // 消息内容
    content: string
    // 创建事件
    createTime: string
    // 流式消息IO
    stream?: Response
}

export interface LLmMole {

    id?: string
    // 模型展示名
    name?: string
    // 发送消息 ollama 请求所需要携带的model参数
    model?: string
    // 模型图标
    picture?: string
    size?: string
    modelDetails?: string
    isDownload?: boolean
    createTime?: string

    // 接收下载参数
    downloads?: any[];
}

export interface ProgressResponse {
    status?: string
    digest?: string
    total: number
    completed?: number
}