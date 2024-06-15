import {defineStore} from "pinia";
import {AppChatPlugin} from "@/components/tool-components/chatGptTool/model/model";


export const useAiPluginStore = defineStore('ai-plugin', {
    state: () => {
        return {
            plugins: [] as AppChatPlugin[],
            currentPlugin: {} as AppChatPlugin,
            checked: [] as string[],
            pluginMenuShowFlag: false,
            ctx: {
                programming: {
                    list: [
                        {
                            selected: false,
                            name: "Go",
                            icon: "img:public/lang/go.png",
                        },
                        {
                            selected: false,
                            name: "Java",
                            icon: "img:public/lang/java.png",
                        },
                        {
                            selected: false,
                            name: "JS",
                            icon: "img:public/lang/js.png",
                        },
                        {
                            selected: false,
                            name: "HTML",
                            icon: "img:public/lang/html.png",
                        },
                        {
                            selected: false,
                            name: "CSS",
                            icon: "img:public/lang/CSS3.png",
                        },
                        {
                            selected: false,
                            name: "Python",
                            icon: "img:public/lang/pyc.png",
                        }
                    ]
                },
                knowledge: []
            }
        }
    },
    persist: true,
    actions: {}
})