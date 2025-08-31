import _axios from '@/utils/request';

export function pageProblemSet({ title, page = 1, pageSize = 10, status }) {
  return _axios({
    url: '/problem-set/page',
    method: 'get',
    params: { title, page, pageSize, status }
  })
}

// 获取题单详情
export function getProblemSetDetail(id) {
  return _axios({
    url: `/problem-set/${id}`,
    method: 'get'
  });
}

// 创建题单
export function addProblemSet(data) {
  return _axios({
    url: '/problem-set',
    method: 'post',
    data
  });
}

// 更新题单基本信息
export function updateProblemSet(id, data) {
  return _axios({
    url: `/problem-set/${id}`,
    method: 'put',
    data
  });
}

// 删除题单
export function deleteProblemSet(id) {
  return _axios({
    url: `/problem-set/${id}`,
    method: 'delete'
  });
}

// 移除内部题目
export function removeInternalProblem(problemSetId, problemId) {
  return _axios({
    url: `/problem-set/internal`,
    method: 'delete',
    params: { problemSetId, problemId }
  });
}

// 移除外部题目
export function removeExternalProblem(problemSetId, problemId) {
  return _axios({
    url: `/problem-set/external`,
    method: 'delete',
    params: { problemSetId, problemId }
  });
}

// 添加内部题目
export function addInternalProblem(problemSetId, problemId) {
  return _axios({
    url: `/problem-set/add-problem/internal`,
    method: 'post',
    params: { problemSetId, problemId }
  });
}


