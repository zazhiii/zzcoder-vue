import request from '@/utils/request'

// 添加题目
export function addProblem(data) {
    return request({
        url: '/problem',
        method: 'post',
        data
    })
}

// 分页查询题目列表
export function getProblemList(data) {
    return request({
        url: '/problem/list',
        method: 'post',
        data
    })
}

// 修改题目
export function updateProblem(data) {
    return request({
        url: 'admin/problem',
        method: 'put',
        data
    })
}

// 删除题目
export function deleteProblem(id) {
    return request({
        url: '/problem',
        method: 'delete',
        params: { id }
    })
}

// 获取题目详情
export function getProblemInfo(id) {
    return request({
        url: `/problem/${id}`,
        method: 'get'
    })
}

// 为题目添加标签
export function addTagToProblem(problemId, tagId) {
    return request({
        url: '/admin/problem/add-tag-to-problem',
        method: 'put',
        params: {
            problemId,
            tagId
        }
    })
}

// 删除题目标签
export function removeTagFromProblem(problemId, tagId) {
    return request({
        url: '/admin/problem/delete-tag-from-problem',
        method: 'delete',
        params: {
            problemId,
            tagId
        }
    })
}

// 获取标签列表
export function getAllTags() {
    return request({
        url: '/tag',
        method: 'get'
    })
}

// 新增标签
export function addTag(name) {
    return request({
        url: '/tag',
        method: 'post',
        params: { name }
    })
}

// 删除标签
export function deleteTag(id) {
    return request({
        url: `/tag/${id}`, 
        method: 'delete'
    })
}

// 获取提交记录
export function getSubmissions(submissionQueryDTO) {
    return request({
        url: '/judge/submission',
        method: 'post',
        data: submissionQueryDTO
    })
}

// 获取提交记录详情
export function getSubmissionInfo(submitId) {
    return request({
        url: `/judge/submission/${submitId}`,
        method: 'get'
    })
}

// 获取题目测试用例
export function getTestCases(problemId) {
    return request({
        url: '/problem/test-cases',
        method: 'get',
        params: { problemId }
    })
}

// 为题目添加测试用例
export function addTestCase(testCase) {
    return request({
        url: '/admin/problem/add-test-case',
        method: 'post',
        data: testCase
    })
}

// 删除题目的测试用例
export function deleteTestCase(id) {
    return request({
        url: '/admin/problem/delete-test-case',
        method: 'delete',
        params: { id }
    })
}


