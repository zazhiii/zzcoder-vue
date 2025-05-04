import _axios from '@/utils/request'

export const getContestList = () => {
    return _axios.get('/contest/list');
}

export const getContestInfo = (id) => {
    return _axios.get(`/contest/${id}`);
}

export const registerContest = (contestId) => {
    return _axios.post('/contest/register', { contestId });
}

export const getContestProblems = (contestId) => {
    return _axios.get('/contest/problem', {
        params: { contestId }
    });
}

export const createContest = (contestDto) => {
    return _axios.post('admin/contest', contestDto);
}
