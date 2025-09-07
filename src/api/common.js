import axios from '../utils/request';

export const uploadFile = (data) => {
    return axios.post('file/upload', data);
};

