import request from '@/utils/request'

// 提交代码
export function submitCode(judgeDTO) {
    return request({
        url: '/judge/submit',
        method: 'post',
        data: judgeDTO
    })
}