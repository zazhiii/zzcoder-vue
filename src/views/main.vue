<template>
    <div class="main-container">
        <el-container>
            <el-header>
                <el-card>
                    <el-menu router mode="horizontal" class="main-menu el-menu-demo">
                        <el-menu-item index="/home">
                            <span>首页</span>
                        </el-menu-item>
                        <el-menu-item index="/problem">
                            <span>题库</span>
                        </el-menu-item>
                        <el-menu-item index="/problem-set">
                            <span>题单</span>
                        </el-menu-item>
                        <el-menu-item index="/contest">
                            <span>竞赛</span>
                        </el-menu-item>
                        <el-menu-item index="/discussion">
                            <span>讨论</span>
                        </el-menu-item>
                        <el-menu-item index="/submission">
                            <span>提交记录</span>
                        </el-menu-item>
                        <div v-if="token">
                            <el-link type="primary" @click="logout" style="float: right;">退出登录</el-link>
                            <el-link type="primary" @click="jump('/user/profile')" style="float: right; margin-right: 10px;">{{userInfo.username}}</el-link>
                            <el-avatar v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" style="float: right; margin-right: 10px;" size="small" />
                        </div>
                        <div v-else>
                            <el-link type="primary" @click="jump('/auth/login-by-password')" style="float: right; margin-right: 10px;">登录</el-link>
                            <el-link type="primary" @click="jump('/auth/register')" style="float: right; margin-right: 10px;">注册</el-link>
                        </div>
                    </el-menu>
                </el-card>
            </el-header>

            <el-container>
                <el-main>
                    <router-view/>
                </el-main>
            </el-container>

        </el-container>
    </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { removeToken } from '@/utils/auth'
import { logout } from '@/api/auth'

export default {
    name: 'MainPage',
    computed: {
        userInfo() {
            return this.$store.state.userInfo;
        },
    },
    mounted() {
        if (this.token) {
            this.$store.dispatch('getUserInfo');
        }
    },
    data() {
        return {
            token: getToken(),
        }
    },
    methods: {
        jump(url) {
            if (this.$route.path !== url) {
                this.$router.replace(url);
            }
        },
        async logout() {
            await logout();
            removeToken();
            this.$store.commit('clearUserInfo');
            location.reload();
        }
    }
}
</script>
<style scoped>
</style>
