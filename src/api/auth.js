import axios from '@/utils/request'

export const login = ({ identification, password }) => {
    return axios.post('/login', { identification, password })
}

export const loginByEmailcode = ({ email, emailCode }) => {
    return axios.post('/login-by-email-code', { email, emailCode })
}

export const logout = () => {
    return axios.get('/logout')
}

export const register = ({ username, password, email, emailCode }) => {
    return axios.post('/register', { username, password, email, emailCode })
}

export const sendEmailCode = ({ email, bizType }) => {
    return axios.get('/send-email-code', {
        params: { email, bizType }
    })
}

export const updatePassword = ({ oldPassword, newPassword }) => {
    return axios.post('/update-password', { oldPassword, newPassword })
}

export const updatePasswordByEmail = ({ email, emailCode, newPassword }) => {
    return axios.post('/update-password-by-email', { email, emailCode, newPassword })
}

