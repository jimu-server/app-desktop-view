import {App, Component} from "vue";
import NotifyTool from "@/components/system-components/tool/notifyTool/NotifyTool.vue";
import ManageTool from "@/components/system-components/tool/manageTool/ManageTool.vue";
import NotifyBtn from "@/components/system-components/tool/notifyTool/NotifyBtn.vue";
import UserManagePage from "@/components/system-components/tool/manageTool/page/UserManagePage.vue";
import OrgManagePage from "@/components/system-components/tool/manageTool/page/OrgManagePage.vue";
import FunManagePage from "@/components/system-components/tool/manageTool/page/FunManagePage.vue";
import ToolManagePage from "@/components/system-components/tool/manageTool/page/ToolManagePage.vue";
import RouterManagePage from "@/components/system-components/tool/manageTool/page/RouterManagePage.vue";
import ChatGPT from "@/components/tool-components/chatGptTool/ChatGPT.vue";


const components = [
    ChatGPT,
    NotifyTool,
    ManageTool,
    NotifyBtn,
    UserManagePage,
    OrgManagePage,
    RouterManagePage,
    FunManagePage,
    ToolManagePage,
]

export function init(app: App) {
    components.forEach(component => {
        if (component.__name !== undefined) {
            app.component(component.__name, component)
        }
        if (component.name !== undefined) {
            app.component(component.name, component)
        }
    })
}