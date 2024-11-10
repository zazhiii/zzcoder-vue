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
            roles: [],
            permissions: []
        }
    },
    getters: {
    },
    mutations: {
        setUserInfo(state, { username, avatarUrl, roles, permissions }) {
            state.userInfo.username = username;
            state.userInfo.avatarUrl = avatarUrl;
            state.userInfo.roles = roles;
            state.userInfo.permissions = permissions;
        },
        clearUserInfo(state) {
            state.userInfo.username = '';
            state.userInfo.avatarUrl = '';
            state.userInfo.roles = [];
            state.userInfo.permissions = [];
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
