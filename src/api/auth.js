import axios from '@/utils/request'

export const login = ({identification, password}) => {
    return axios.post('/login', { identification, password })
}

export const loginByEmailcode = ({email, emailVerificationCode}) => {
    return axios.post('/login-by-email-code', { email, emailVerificationCode })
}

export const logout = () => {
    return axios.get('/logout')
}

export const register = ({username, password, email, emailVerificationCode}) => {
    return axios.post('/register', { username, password, email, emailVerificationCode })
}

export const sendEmailVerificationCode = ({email}) => { 
    return axios.get('/send-email-verification-code', {
        params: { email }
    })
}

export const updatePassword = ({oldPassword, newPassword}) => {
    return axios.post('/update-password', { oldPassword, newPassword })
}

export const updatePasswordByEmail = ({email, emailVerificationCode, newPassword}) => {
    return axios.post('/update-password-by-email', { email, emailVerificationCode, newPassword })
}

