import {ipcRenderer} from "electron";


export function desktop_login() {
    ipcRenderer.send('login')
}

export function desktop_logout() {
    ipcRenderer.send('logout')
}

export function desktop_minimize() {
    ipcRenderer.send('window-min')
}

export function desktop_close() {
    ipcRenderer.send('window-quite')
}

export function desktop_max() {
    ipcRenderer.send('window-max')
}

export function desktop_exit() {
    ipcRenderer.send('window-exit')
}
