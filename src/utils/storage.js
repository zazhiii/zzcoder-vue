const USER_INFO_KEY = 'user_info'

// 获取个人信息
export const getUserInfoLocal = () => {
    const result = localStorage.getItem(USER_INFO_KEY)
    return JSON.parse(result)
}

// 设置个人信息
export const setUserInfoLocal = (info) => {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(info))
}

// 移除个人信息
export const removeUserInfoLocal = () => {
    localStorage.removeItem(USER_INFO_KEY)
}