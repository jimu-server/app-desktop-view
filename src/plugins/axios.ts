import axios, {AxiosInstance, AxiosResponse} from 'axios';
const Axios: AxiosInstance = axios.create({
    baseURL: 'http://82.157.160.117:10002',
    timeout: 5000,
})


Axios.interceptors.request.use(function (request) {
    return request
})

Axios.interceptors.response.use(function (response:AxiosResponse<any>) {
        return response
    }, function (error) {

        return error.response
    })

export default Axios
