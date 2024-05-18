// 创建 Ollama 的axios请求实例
import axios, {AxiosInstance} from "axios";
import {OllamaModelResponse} from "@/components/tool-components/chatGptTool/model/model";
import {Result} from "@/components/system-components/model/system";
import {GetHeaders} from "@/plugins/axiosutil";
import {getServer} from "@/components/tool-components/chatGptTool/gptutil";
import {LocalOllama} from "@/components/tool-components/chatGptTool/gptAxios";




export function getLLmMole() {
    return new Promise<OllamaModelResponse[]>(resolve => {
        LocalOllama.get<Result<OllamaModelResponse[]>>("/api/chat/model/list").then(({data}) => {
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

/*
* @description 下载指定模型,返回下载流
* */
export async function downloadOllamaModel(data: any): Promise<Response> {
    let serverUrl = getServer()
    return await genStream(`${serverUrl}/api/chat/model/pull`, data);
}

export async function genStream(url: string, data: any): Promise<Response> {
    // tip 此处的 response 不能 clone 返回,会无法清空取消持续读取
    return await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...GetHeaders()
        },
        body: JSON.stringify(data),
    });
}

