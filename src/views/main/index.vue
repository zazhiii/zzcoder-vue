<template>
  <div class="main-container">
    <el-container>
      <el-header class="header">
        <el-menu router :default-active=this.$route.path mode="horizontal">
          <el-menu-item index="/home">首页</el-menu-item>
          <el-menu-item index="/problem">题库</el-menu-item>
          <el-menu-item index="/problem-set">题单</el-menu-item>
          <el-menu-item index="/contest">竞赛</el-menu-item>
          <div v-if="isLogin">
            <el-link type="primary" @click="logout" class="user-actions">退出登录</el-link>
            <el-link type="primary" @click="jump('/user')" class="user-actions">
              {{ userInfo.username }}
            </el-link>
            <el-avatar v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl"
                       class="user-actions" size="small"/>
          </div>
          <div v-else>
            <el-link type="primary" @click="jump('/auth/login-by-password')"
                     class="user-actions">登录
            </el-link>
            <el-link type="primary" @click="jump('/auth/register')"
                     class="user-actions">注册
            </el-link>
          </div>
        </el-menu>
      </el-header>
      <el-main class="main">
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {removeToken} from '@/utils/cookie'
import {logout} from '@/api/auth'
import {mapActions, mapMutations, mapState} from "vuex";

export default {
  name: 'MainPage',
  computed: {
    ...mapState('user', ['userInfo', 'isLogin'])
  },
  created() {
    if (this.isLogin) {
      this.getUserInfo() // 用户信息
    }
  },
  methods: {
    ...mapActions('user', ['getUserInfo']),
    ...mapMutations('user', ['clearUserInfo', 'setLogin']),
    jump(url) {
      if (this.$route.path !== url) {
        this.$router.replace(url);
      }
    },
    async logout() {
      await logout();
      removeToken();
      this.setLogin(false);
      this.clearUserInfo()
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
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
.main{
  padding-top: 65px;
}
</style>
