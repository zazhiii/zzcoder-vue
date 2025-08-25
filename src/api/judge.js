import _axios from '@/utils/request'

// 提交代码
export function submitCode(judgeDTO) {
    return _axios({
        url: '/judge/submit',
        method: 'post',
        data: judgeDTO
    })
}

export function getUserProblemSubmissions(problemId){
    return _axios.get(`/judge/submission/user/${problemId}`)
}