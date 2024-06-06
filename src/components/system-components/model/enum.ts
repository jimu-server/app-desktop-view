export enum ToolLayout {
    // 左侧工具栏
    Left = 1,
    // 右侧工具栏
    Right = 2
}

export enum ToolBtnType {
    // 路由类型工具按钮(没有自定义的工具侧边窗口)
    ToolRouteBtn = 1,
    // 窗口工具按钮组(有自定义的工具侧边窗口)
    ToolWindowBtn = 2
}

export enum NotifyMsgType {
    Info = 1,
    Success,
    Warning,
    Error,
}

export enum NotifyStatus {
    UnRead = 0,
    Read = 1,
}

export enum NotifyToolStatusType {
    // 未读消息类型
    UnReadNotify = 0,
    // 消息以全部读取
    ReadAllNotify = 1,
    // 没有消息通知
    NoNotify = 2,
}
