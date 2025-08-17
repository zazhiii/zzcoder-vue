import {getUserInfo} from "@/api/user";
import {getUserInfoLocal, setUserInfoLocal, removeUserInfoLocal} from "@/utils/storage";
import {getToken} from "@/utils/cookie";

export default {
    namespaced: true,
    state: {
        userInfo: {
            username: '',
            avatarUrl: '',
            roles: [],
            permissions: []
        },
        isLogin: getToken()
    },
    mutations: {
        setLogin(state, isLogin) {
            state.isLogin = isLogin;
        },
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
            setUserInfoLocal(userInfo);
        },
        clearUserInfo(state) {
            state.userInfo = {
                username: '',
                avatarUrl: '',
                roles: [],
                permissions: []
            }
            removeUserInfoLocal()
        }
    },
    actions: {
        async getUserInfo({ commit }) {
            // 先从 localStorage 拿，没有再请求
            let userInfo = getUserInfoLocal()
            if(!userInfo) {
                userInfo = await getUserInfo();
            }
            commit('setUserInfo', userInfo); // 提交mutation更新用户信息
        }
    },
    getters: {
    },
}