import _axios from "../utils/request";

export const getUserInfo = () => {
    return _axios.get("/user")
}

export const updateEmail = (data) => {
    return _axios.put("/user/email", data)
}

export const updateUserAvatar = (avatarUrl) => {
    return _axios.put("/user/avatar", {}, { params: { avatarUrl } })
}

export const updateUserProfile = (data) => {
    return _axios.put("/user/profile", data)
}

// 获取用户提交统计信息
export function getSubmitStat() {
    return _axios.get("/user/submit-stat")
}