import _axios from '@/utils/request';

export function pageProblemSet({title, page = 1, pageSize = 10, status}) {
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

// 更新题单
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

// 向题单添加题目
export function addProblemToProblemSet(problemSetId, data) {
  return _axios({
    url: `/problemSet/${problemSetId}/problems`,
    method: 'post',
    data
  });
}

// 从题单移除题目
export function removeProblemFromProblemSet(problemSetId, problemId) {
  return _axios({
    url: `/problemSet/${problemSetId}/problems/${problemId}`,
    method: 'delete'
  });
}
