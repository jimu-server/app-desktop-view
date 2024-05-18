import axios, {AxiosInstance} from "axios";
import {GetHeaders} from "@/plugins/axiosutil";
import Axios from "@/plugins/axiosForServer";

export const LocalOllama: AxiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8080',
    timeout: 5000,
})
export const OriginOllama: AxiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8080',
    timeout: 5000,
})
LocalOllama.interceptors.request.use(headers)
OriginOllama.interceptors.request.use(headers)

function headers(request) {
    request.headers = GetHeaders()
    return request
}