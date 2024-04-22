import {app, BrowserView, BrowserWindow, clipboard, dialog, ipcMain, nativeImage, session, shell, Tray} from 'electron'
import {release} from 'node:os'
import {join} from 'node:path'
import * as path from "path";


// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? join(process.env.DIST_ELECTRON, '../public')
    : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// 主窗口
let win: BrowserWindow | null = null
let winId: number | null = 0

// 聊天消息预览窗口
let previewWin: BrowserWindow | null = null

// 好友管理器
let manageAccounts: BrowserWindow | null = null

// 查找窗口
let searchWin: BrowserWindow | null = null


// 托盘
let tray: Tray | null = null
let trayMenu: BrowserWindow | null = null
let trayMessageView: BrowserView | null = null
let trayShow: boolean = false
let trayMessageShow: boolean = false

// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

process.env.VITE_DEV_SERVER_URL
    ? join(process.env.DIST_ELECTRON, "../public")
    : process.env.DIST;

const vueDevToolsPath = path.resolve(__dirname, '../../6.5.1_0')
const appIcon = join(__dirname, "../../build/icons/icon.ico")

async function createWindow() {
    win = new BrowserWindow({
        title: 'online',
        width: 360,
        height: 450,
        minWidth: 360,
        minHeight: 450,
        icon: appIcon,
        frame: false,
        resizable: false,
        maximizable: false,
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
            partition: String(+new Date())
        },
    })
    winId = win.id
    if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
        // console.log(url)
        await win.loadURL(url + '#/login')
        // 打开浏览器调试窗口
        win.webContents.openDevTools()
    } else {
        await win.loadFile(indexHtml)
    }

    // Test actively push message to the Electron-Renderer
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', new Date().toLocaleString())
    })

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({url}) => {
        if (url.startsWith('https:')) shell.openExternal(url)
        return {action: 'deny'}
    })


    /*
    *  @description: resize 监听窗口大小改变
    * */
    win.on('resize', (event) => {
        win.webContents.send('win-change')
    })

    /*
    * @description: 放大窗口监听
    * */
    win.on('maximize', (event) => {
        win.webContents.send('win-change')
    })

    /*
    * @description: 取消最大化监听
    * */
    win.on('unmaximize', (event) => {
        win.webContents.send('win-change')
    })

    /*
    * @description: 最小化窗口监听
    * */
    win.on('minimize', (event) => {
        win.webContents.send('win-change')
    })

    /*
    * @description: 取消最小化窗口监听
    * */
    win.on('restore', (event) => {
        win.webContents.send('win-change')
    })

    // win.webContents.on('will-navigate', (event, url) => { }) #344win
}

app.whenReady().then(async () => {
    await createWindow()
    // 加载 vue 调试器插件
    console.log(vueDevToolsPath)
    await session.defaultSession.loadExtension(vueDevToolsPath)
    createTray()
})


app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
    }
})

ipcMain.on('DevTools', () => {
    if (win.webContents.isDevToolsOpened()) {
        win.webContents.closeDevTools()
    } else {
        win.webContents.openDevTools()
    }
})

ipcMain.on('login', () => {
    if (win) {
        win.hide()
        setTimeout(() => {
            win.setMinimumSize(1000, 600)
            win.setContentSize(1000, 600)
            win.center()
            win.setMaximizable(true)
            win.setResizable(true)
            win.setMinimizable(true)
            win.show()
        }, 1000)

    }
})

/*
* @description 执行登出操作
* 修改窗口大小
* */
ipcMain.on('logout', () => {
    if (win) {
        win.hide()
        setTimeout(() => {
            if (win.isMaximized()) {
                win.restore()
            }
            win.setMinimumSize(360, 450)
            win.setContentSize(360, 450)
            win.center()
            win.setResizable(false)
            win.setMaximizable(false)
            win.show()
        }, 1000)
    }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
    const childWindow = new BrowserWindow({
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
        },
    })

    if (process.env.VITE_DEV_SERVER_URL) {
        childWindow.loadURL(`${url}#${arg}`)
    } else {
        childWindow.loadFile(indexHtml, {hash: arg})
    }
})

ipcMain.on("on-copy", () => {

    let text = clipboard.readText()
    console.log(text)
})

/*
* @description: 执行推出应用程序
* */
ipcMain.on("window-quite", () => {
    win.hide()
})


/*
* @description: 执行推出应用程序
* */
ipcMain.on("window-logout", () => {

})


ipcMain.on("window-max", (event, args) => {
    if (win.isMaximized()) {
        win.restore()
    } else {
        win.maximize()
    }
    event.sender.send("win-change")
})

ipcMain.on("window-min", (event) => {
    if (win.isMinimized()) {
        win.restore()
    } else {
        win.minimize()
    }
    event.sender.send("win-change")
})

ipcMain.on("login-app", (event) => {
    event.sender.send("init-im-listener")
})


function createTray() {
    trayMessageView = new BrowserView()
    // 创建 托盘图标
    const icon = nativeImage.createFromPath(appIcon)
    tray = new Tray(icon)

    trayMenu = new BrowserWindow({
        title: 'tray',
        width: 100,
        height: 200,
        minWidth: 100,
        minHeight: 200,
        frame: false,
        resizable: false,
        maximizable: false,
        skipTaskbar: false,
        alwaysOnTop: true,
        show: false,
        webPreferences: {
            preload,
            // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
            // Consider using contextBridge.exposeInMainWorld
            // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
            nodeIntegration: true,
            contextIsolation: false,
            // partition: String(+new Date())
        },
    })
    trayMenu.loadURL(url + "#/tray")

    /*
    * @description: 双击托盘图标，显示窗口
    * */
    tray.on('double-click', () => {
        if (!win.isVisible()) {
            win.show()
            win.moveTop()
        }
        win.moveTop()
        trayMenu.hide()
    })

    tray.on('right-click', (event, point) => {
        // trayMenu.setPosition(point.x - (point.width / 2), point.y - (point.height / 2))
        trayMenu.setPosition(point.x + (point.width / 2), point.y - 200 + (point.height / 2))
        trayMenu.show()
        trayMenu.setAlwaysOnTop(true, 'pop-up-menu')
    })

    tray.on("mouse-enter", (event, point) => {
        closeTray()
    })

    tray.on("mouse-move", (event, point) => {
        closeTray()
    })

    tray.on("mouse-leave", (event, point) => {
        closeTray()
    })

    tray.setToolTip('jimu-os')
}


// 托盘菜单 关闭防抖函数
let trayTimer = null;

function debounce_tray(fn: Function, delay: number) {
    return function (...args: any) {
        clearTimeout(trayTimer);
        trayTimer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

ipcMain.on('close-tray', () => {
    closeTray()
})

function closeTray() {
    debounce_tray(() => {
        trayMenu.hide()
    }, 3000)()
}


/*
* @description: 创建消息预览窗口
* */
function createPreviewWindow() {
    previewWin = new BrowserWindow({
        width: 700,
        height: 500,
        minWidth: 700,
        minHeight: 500,
        // parent:BrowserWindow.fromId(winId),
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    })
    previewWin.loadURL(url + "#/preview")
    // Open devTool if the app is not packaged
    previewWin.webContents.openDevTools()
}

/*
* @description: 打开消息预览窗口
* */
ipcMain.on("open-message-preview", (event, args) => {
    if (previewWin) {
        if (!previewWin.isVisible()) {
            previewWin.show()
        } else {
            previewWin.moveTop()
        }
    } else {
        createPreviewWindow()
    }
    previewWin.webContents.send("load-preview")
})

/*
* @description: 关闭消息预览窗口
* */
ipcMain.on("close-message-preview", (event) => {
    if (!previewWin.isDestroyed()) {
        previewWin.hide()
    }
})


/*
* @description: 最大化消息预览窗口
* */
ipcMain.on("max-message-preview", (event) => {
    if (previewWin.isMaximized()) {
        previewWin.restore()
    } else {
        previewWin.maximize()
    }
})


/*
* @description: 最小化消息预览窗口
* */
ipcMain.on("min-message-preview", (event) => {
    if (previewWin.isMinimized()) {
        previewWin.restore()
    } else {
        previewWin.minimize()
    }
})

ipcMain.on("open-select-dir", (event) => {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }).then(result => {
        if (result.canceled) {
            return
        }
        console.log(result.filePaths[0])
        event.sender.send("select-dir", result.filePaths[0])
    })
})


/*
* @description: 创建账号管理窗口
* */
function createManageAccountsWindow() {
    manageAccounts = new BrowserWindow({
        width: 700,
        height: 500,
        minWidth: 700,
        minHeight: 500,
        parent: BrowserWindow.fromId(winId),
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    })
    manageAccounts.loadURL(url + "#/manageAccounts")
    // Open devTool if the app is not packaged
    manageAccounts.webContents.openDevTools()
}

/*
* @description: 打开账号管理窗口
* */
ipcMain.on("open-manage-accounts-window", (event, args) => {
    if (manageAccounts) {
        if (!manageAccounts.isVisible()) {
            manageAccounts.show()
        } else {
            manageAccounts.moveTop()
        }
    } else {
        createManageAccountsWindow()
    }
})

/*
* @description: 关闭账号管理窗口
* */
ipcMain.on("close-manage-accounts-window", (event) => {
    if (!manageAccounts.isDestroyed()) {
        manageAccounts.hide()
    }
})

/*
* @description: 最大化账号管理窗口
* */
ipcMain.on("max-manage-accounts-window", (event) => {
    if (manageAccounts.isMaximized()) {
        manageAccounts.restore()
    } else {
        manageAccounts.maximize()
    }
})


/*
* @description: 最小化账号管理窗口
* */
ipcMain.on("min-manage-accounts-window", (event) => {
    if (manageAccounts.isMinimized()) {
        manageAccounts.restore()
    } else {
        manageAccounts.minimize()
    }
})


/*
* @description: 创建账号管理窗口
* */
function createSearchWindow() {
    searchWin = new BrowserWindow({
        width: 700,
        height: 500,
        minWidth: 700,
        minHeight: 500,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    })
    searchWin.loadURL(url + "#/search")
    // Open devTool if the app is not packaged
    searchWin.webContents.openDevTools()
}

/*
* @description: 打开账号查询窗口
* */
ipcMain.on("open-search-window", (event, args) => {
    if (searchWin) {
        if (!searchWin.isVisible()) {
            searchWin.show()
            searchWin.webContents.openDevTools()
        } else {
            searchWin.moveTop()
        }
    } else {
        createSearchWindow()
    }
})

/*
* @description: 关闭账号查询窗口
* */
ipcMain.on("close-search-window", (event) => {
    if (!searchWin.isDestroyed()) {
        searchWin.hide()
    }
})

// 主进程向渲染主主窗口查询好友信息
ipcMain.on('search-action', (event, args) => {
    win.webContents.send('search-friend-group', args)
})

// 返回给查询窗口数据结果
ipcMain.on('search-action-result', (event, args) => {
    searchWin.webContents.send('search-result', args)
})


// 执行添加好友
ipcMain.on('add-action', (event, args) => {
    win.webContents.send('add-friend-group', args)
})

// 添加好友返回结果
ipcMain.on('add-action-result', (event, args) => {
    searchWin.webContents.send('add-result', args)
})







