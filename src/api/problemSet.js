import request from '@/utils/request'

export function addProblemSet(data) {
    return request({
        url: '/problem-set',
        method: 'post',
        data
    });
}

export function updateProblemSet(data) {
    return request({
        url: '/problem-set',
        method: 'put',
        data
    });
}

export function pagePublicProblemSet(page = 1, size = 10, title) {
    return request({
        url: '/problem-set/public',
        method: 'get',
        params: { page, size, title }
    });
}

export function listMyProblemSet() {
    return request({
        url: '/problem-set/my',
        method: 'get'
    });
}

export function addProblemToProblemSet(problemSetId, problemId) {
    return request({
        url: '/problem-set/add-problem',
        method: 'post',
        params: { problemSetId, problemId }
    });
}

export function deleteProblemFromProblemSet(problemSetId, problemId) {
    return request({
        url: '/problem-set/delete-problem',
        method: 'delete',
        params: { problemSetId, problemId }
    });
}

export function getProblemSet(id) {
    return request({
        url: `/problem-set/${id}`,
        method: 'get'
    });
}

export function deleteProblemSet(id) {
    return request({
        url: `/problem-set/${id}`,
        method: 'delete'
    });
}


