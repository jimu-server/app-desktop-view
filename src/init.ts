import {App, Component} from "vue";
import NotifyTool from "@/components/system-components/tool/notifyTool/NotifyTool.vue";
import ManageTool from "@/components/system-components/tool/manageTool/ManageTool.vue";
import NotifyBtn from "@/components/system-components/tool/notifyTool/NotifyBtn.vue";
import UserManagePage from "@/components/system-components/tool/manageTool/page/UserManagePage.vue";
import OrgManagePage from "@/components/system-components/tool/manageTool/page/OrgManagePage.vue";
import FunManagePage from "@/components/system-components/tool/manageTool/page/FunManagePage.vue";
import ToolManagePage from "@/components/system-components/tool/manageTool/page/ToolManagePage.vue";
import RouterManagePage from "@/components/system-components/tool/manageTool/page/RouterManagePage.vue";
import ModelManagePage from "@/components/tool-components/chatGptTool/manage/ModelManagePage.vue";
import Login from "@/components/system-components/Login.vue";
import ChatGPT from "@/components/tool-components/chatGptTool/ChatGPT.vue";
import FlowChart from "@/components/tool-components/flowTool/FlowChart.vue";
import OllamaSetting from "@/components/tool-components/chatGptTool/setting/OllamaSetting.vue";
import UserInfoSetting from "@/components/system-components/avatar/UserInfoSetting.vue";


const components = [
    NotifyTool,
    ManageTool,
    NotifyBtn,
    UserManagePage,
    OrgManagePage,
    RouterManagePage,
    FunManagePage,
    ToolManagePage,
    ModelManagePage,
    ChatGPT,
    FlowChart,
    Login,
    OllamaSetting,
    UserInfoSetting
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