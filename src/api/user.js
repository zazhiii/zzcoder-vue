import axios from "../utils/request";

export const getUserInfo = () => {
    return axios.get("/user")
}

export const updateEmail = (data) => {
    return axios.put("/user/email", data)
}

export const updateUserAvatar = (avatarUrl) => {
    return axios.put("/user/avatar", {}, { params: { avatarUrl } })
}
