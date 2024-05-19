import axios, {AxiosInstance} from "axios";
import {GetHeaders} from "@/plugins/axiosutil";
import Axios from "@/plugins/axiosForServer";

export const OllamaServer: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_OLLAMA_API,
    timeout: 5000,
})

OllamaServer.interceptors.request.use(headers)


function headers(request) {
    request.headers = GetHeaders()
    return request
}