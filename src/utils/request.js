import axios from 'axios'
import { getToken } from '@/utils/cookie'
import { Message } from 'element-ui'

// 创建一个 axios 实例
const _axios = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
})

// 请求拦截器
_axios.interceptors.request.use(
    config => {
        // 在请求发送之前执行一些操作
        const token = getToken()
        if (token) {
            // 让每个请求携带 token
            config.headers['Authorization'] = token;
        }
        return config
    },
    error => {
        console.log(error) // 用于调试
        return Promise.reject(error)
    }
)
// 响应拦截器
// 后端返回的Result结构
// code: 1成功，0和其它数字为失败
// msg: 错误信息
// data: 业务数据
_axios.interceptors.response.use(
    response => {
        const body = response.data
        if(body.code !== 1){
            Message({
                message: body.msg || '操作失败',
                type: 'error',
                duration: 5000,
            })
            return Promise.reject(body.msg)
        }
        return body.data
    },
    error => {
        console.log('err' + error) // 用于调试
        let message = '未知错误'
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    message = '请求错误'
                    break
                case 401:
                    message = '未授权，请登录'
                    break
                case 403:
                    message = '禁止访问'
                    break
                case 404:
                    message = `请求地址出错: ${error.response.config.url}`
                    break
                case 408:
                    message = '请求超时'
                    break
                case 500:
                    message = '服务器内部错误'
                    break
                case 501:
                    message = '服务未实现'
                    break
                case 502:
                    message = '网关错误'
                    break
                case 503:
                    message = '服务不可用'
                    break
                case 504:
                    message = '网关超时'
                    break
                case 505:
                    message = 'HTTP版本不受支持'
                    break
                default:
                    message = error.message || '未知错误'
                    break
            }
        } else if (error.request) {
            message = '网络错误，请检查您的网络连接'
        } else {
            message = error.message
        }
        
        Message({
            message: message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default _axios
