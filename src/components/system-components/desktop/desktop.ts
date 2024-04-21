import {ipcRenderer} from "electron";


export function desktop_login() {
    ipcRenderer.send('login')
}

export function desktop_minimize() {
    ipcRenderer.send('window-min')
}

export function desktop_close() {
    ipcRenderer.send('window-quite')
}
