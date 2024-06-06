import {app, BrowserWindow, clipboard, dialog, ipcMain, nativeImage, session, shell, Tray} from 'electron'
import {release} from 'node:os'
import {join} from 'node:path'
import * as path from "path";

import {exec} from 'node:child_process'
import {ChildProcess} from "child_process";


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


// 托盘
let tray: Tray | null = null
let trayMenu: BrowserWindow | null = null

// 本地服务
let server: ChildProcess = null

// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

process.env.VITE_DEV_SERVER_URL
    ? join(process.env.DIST_ELECTRON, "../public")
    : process.env.DIST;

const vueDevToolsPath = path.resolve(__dirname, '../../6.5.1_0')
let appIcon = null
let appServerPath = null

// app 图标
if (process.env.VITE_DEV_SERVER_URL) {
    appIcon = join(__dirname, "../../build/icons/1024x1024.png")
} else {
    // 生产环境 图标加载位置为打包后的位置
    appIcon = join(path.dirname(app.getPath('exe')), "resources/build/icons/icon.ico")
}

// app 本地服务器
if (process.env.VITE_DEV_SERVER_URL) {
    appServerPath = join(__dirname, "../../server/app.exe")
} else {
    // 生产环境 本地服务器 加载位置为打包后的位置
    appServerPath = join(path.dirname(app.getPath('exe')), "resources/server/app.exe")
}



async function createWindow() {
    win = new BrowserWindow({
        title: 'jimuos',
        width: 360,
        height: 450,
        minWidth: 360,
        minHeight: 450,
        icon: appIcon,
        frame: false,
        resizable: false,
        maximizable: false,
        // transparent: true,
        titleBarStyle: 'hidden',
        // skipTaskbar: true,
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
            partition: String(+new Date())
        },
    })
    // win.setIgnoreMouseEvents(false, {forward: true})
    winId = win.id
    if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
        // console.log(url)
        await win.loadURL(url + '#/login')
        // 打开浏览器调试窗口
        win.webContents.openDevTools()
    } else {
        await win.loadURL(indexHtml + '#/login')
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
}


function startAppLocalServer() {
    if (appServerPath) {
        server = exec(appServerPath, (error, stdout, stderr) => {
            if (error) {
                console.error(error)
            }
            if (stderr) {
                console.error(stderr)
            }
            if (stdout) {
                console.log(stdout)
            }
        })
    }
}

app.whenReady().then(async () => {
    app.setUserTasks([])
    await createWindow()
    await createTray()
    // 加载 vue 调试器插件
    await session.defaultSession.loadExtension(vueDevToolsPath)
    // 加载本地服务
    if (process.env.VITE_USER_NODE_ENV=="production.electron"){
        console.log("begin start ollama server")
        startAppLocalServer()
    }
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

app.on('activate', async () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        await createWindow()
    }
})


app.on('quit', () => {
    if (tray) {
        tray.destroy()
    }
    // 结束正在运行的 服务器程序
    if (server) {
        server.kill()
        console.log("shut down server")
    }
})

ipcMain.on('DevTools', () => {
    if (win.webContents.isDevToolsOpened()) {
        win.webContents.closeDevTools()
    } else {
        win.webContents.openDevTools()
    }
})

ipcMain.on('toggle', () => {
    if (win) {
        if (win.isMaximized()) {
            win.unmaximize()
        } else {
            win.maximize()
        }
    }
})

ipcMain.on('login', () => {
    if (win) {
        win.hide()
        setTimeout(() => {
            win.setMaximizable(true)
            win.setResizable(true)
            win.setMinimizable(true)

            win.setMinimumSize(1200, 800)
            win.setContentSize(1200, 800)
            win.setSize(1200, 800)
            win.center()

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
            win.setResizable(false)
            win.setMaximizable(false)
            win.setMinimumSize(360, 450)
            win.setContentSize(360, 450)
            win.setSize(360, 450)
            win.center()

            win.show()
        }, 1000)
    }
})

// New window example arg: new windows url
ipcMain.handle('open-win', async (_, arg) => {
    const childWindow = new BrowserWindow({
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
        },
    })

    if (process.env.VITE_DEV_SERVER_URL) {
        await childWindow.loadURL(`${url}#${arg}`)
    } else {
        await childWindow.loadFile(indexHtml, {hash: arg})
    }
})

ipcMain.on("on-copy", () => {
    let text = clipboard.readText()
})

/*
* @description: 执行关闭应用程序
* */
ipcMain.on("window-quite", () => {
    win.hide()
})

ipcMain.on("window-exit", () => {
    app.quit()
})


/*
* @description: 执行推出应用程序
* */
ipcMain.on("window-logout", () => {

})


ipcMain.on("window-max", (event, args) => {
    if (win.isMaximized()) {
        win.unmaximize()
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

ipcMain.on("theme", (event, args) => {
    trayMenu.webContents.send("theme-change", args)
})

let showFlag = false

async function createTray() {
    // trayMessageView = new BrowserView()
    // 创建 托盘图标
    const icon = nativeImage.createFromPath(appIcon)
    tray = new Tray(icon)
    // 当前 ui 写的托盘菜单最低30(单个菜单项)
    let menuHeight = 30
    trayMenu = new BrowserWindow({
        title: 'tray',
        width: 100,
        height: menuHeight,
        frame: false,
        resizable: false,
        maximizable: false,
        skipTaskbar: false,
        alwaysOnTop: true,
        show: false,
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
            partition: String(+new Date())
        },
    })
    if (process.env.VITE_DEV_SERVER_URL) {
        await trayMenu.loadURL(url + "#/tray")
    } else {
        await trayMenu.webContents.loadURL(indexHtml + "#/tray")
    }
    trayMenu.on('blur', () => {
        trayMenu.hide()
    })

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
        trayMenu.setPosition(point.x + (point.width / 2), point.y - menuHeight + (point.height / 2))
        trayMenu.show()
        trayMenu.focus()
        trayMenu.setAlwaysOnTop(true, 'pop-up-menu')
    })
    tray.on("mouse-enter", (event, point) => {
    })
    tray.on("mouse-move", (event, point) => {
    })
    tray.on("mouse-leave", (event, point) => {
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
    debounce_tray(() => {
        trayMenu.hide()
    }, 500)
})






