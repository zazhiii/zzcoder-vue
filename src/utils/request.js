import axios from 'axios'
import { getToken } from '@/utils/auth'
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
_axios.interceptors.response.use(
    response => {
        const body = response.data
        if (body.code === 1) {
            return body
        } else {
            Message({
                message: body.msg || '请求失败',
                type: 'error',
                duration: 4 * 1000
            })
            return Promise.reject(new Error(body.msg || '请求失败'))
        }
    },
    error => {
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default _axios
