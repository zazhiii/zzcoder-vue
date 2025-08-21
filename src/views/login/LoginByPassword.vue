<template>

  <el-form :model="loginForm" :rules="loginRules" ref="loginForm">
    <h1 style="text-align: center; margin-bottom: 20px;">密码登录</h1>
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" placeholder="用户名/邮箱/手机号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="loginForm.password" type="password" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitLogin" style="width: 100%;">登录</el-button>
    </el-form-item>
    <el-form-item>
      <el-link type="primary" style="float: left;" @click="jump('/auth/login-by-code')">验证码登录</el-link>
      <el-link type="primary" style="float: right;" @click="jump('/auth/register')">注册</el-link>
      <el-link type="primary" style="float: right;" @click="jump('/auth/reset-password')">忘记密码？</el-link>
    </el-form-item>
  </el-form>
</template>

<script>
import {login} from '@/api/auth'
import {setToken} from '@/utils/cookie'
import {mapMutations} from "vuex";

export default {
  name: 'LoginView',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          {required: true, message: '请输入用户名/邮箱/手机号', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      },
    };
  },
  methods: {
    ...mapMutations('user', ['setLogin']),
    jump(url) {
      this.$router.replace(url);
    },
    submitLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          const {username, password} = this.loginForm
          try {
            // 调用登录 API，传入用户名和密码
            const data = await login({identification: username.trim(), password: password})
            setToken(data)
            // 跳转到主页
            this.$router.replace('/')
          } catch (error) {
            console.error('登录错误:', error);
          }
        }
      });
    }
  }
}
</script>