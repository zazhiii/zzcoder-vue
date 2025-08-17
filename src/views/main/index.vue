<template>
    <div class="main-container">
        <el-container>
            <el-header>
                <el-menu router :default-active=this.$route.path mode="horizontal">
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
                    <div v-if="token">
                        <el-link type="primary" @click="logout" class="user-actions">退出登录</el-link>
                        <el-link type="primary" @click="jump('/user')" class="user-actions">
                            {{userInfo.username }}
                        </el-link>
                        <el-avatar v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl"
                            class="user-actions" size="small" />
                    </div>
                    <div v-else>
                        <el-link type="primary" @click="jump('/auth/login-by-password')"
                            class="user-actions">登录</el-link>
                        <el-link type="primary" @click="jump('/auth/register')"
                            class="user-actions">注册</el-link>
                    </div>
                </el-menu>
            </el-header>
            <el-main>
                <router-view />
            </el-main>

        </el-container>
    </div>
</template>

<script>
import { getToken } from '@/utils/cookie'
import { removeToken } from '@/utils/cookie'
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
            try {
                await logout();
            } catch (error) {
                this.$message.error(error.message);
            } finally {
                removeToken();
                this.$store.commit('clearUserInfo');
            }
            this.jump('/home');
            location.reload(); // 刷新页面
            this.$message.success('退出成功');
        }
    }
}
</script>
<style scoped>
/* 右侧用户相关区域容器 */
.user-actions {
  float: right;
  margin-right: 20px;
  margin-top: 20px;
}
</style>
