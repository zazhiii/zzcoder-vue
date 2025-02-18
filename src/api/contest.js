import axios from '@/utils/request'

export const getContestList = () => {
    return axios.get('/contest/list');
}

export const getContestInfo = (id) => {
    return axios.get(`/contest/${id}`);
}

export const registerContest = (contestId) => {
    return axios.post('/contest/register', { contestId });
}

export const getContestProblems = (contestId) => {
    return axios.get('/contest/problem', {
        params: { contestId }
    });
}
