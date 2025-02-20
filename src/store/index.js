import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { getUserInfo } from '@/api/user'

export default new Vuex.Store({
    namespaced: true,
    state: {
        userInfo: {
            username: '',
            avatarUrl: '',
        }
    },
    getters: {
    },
    mutations: {
        setUserInfo(state, { username, avatarUrl}) {
            state.userInfo.username = username;
            state.userInfo.avatarUrl = avatarUrl;
        },
        clearUserInfo(state) {
            state.userInfo.username = '';
            state.userInfo.avatarUrl = '';
        }
    },
    actions: {
        async getUserInfo({ commit }) {
            const { data } = await getUserInfo(); // 调用接口获取用户信息
            commit('setUserInfo', data); // 提交mutation更新用户信息
            return data; // 返回用户信息
        }
    },
    modules: {
    }
})
