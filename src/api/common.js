import axios from '../utils/request';

export const uploadFile = (data) => {
    return axios.post('/common/upload', data);
};

