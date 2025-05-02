<template>
    <el-form :model="loginForm" :rules="loginRules" ref="loginForm">
        <h1 style="text-align: center; margin-bottom: 20px;">验证码登录</h1>
        <el-form-item prop="email">
            <el-input v-model="loginForm.email" placeholder="邮箱" style="width: 68%;"></el-input>
            <SendEmailCode :email="loginForm.email" />
        </el-form-item>
        <el-form-item prop="code">
            <el-input v-model="loginForm.code" placeholder="验证码"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitLogin" style="width: 100%;">登录</el-button>
        </el-form-item>
        <el-form-item>
            <el-link type="primary" style="float: left;" @click="jump('/auth/login-by-password')">密码登录</el-link>
            <el-link type="primary" style="float: right;" @click="jump('/auth/register')">注册</el-link>
        </el-form-item>
    </el-form>
</template>

<script>
import { setToken } from '@/utils/cookie'
import { loginByEmailcode } from '@/api/auth'
import SendEmailCode from './components/SendEmailCode.vue'

export default {
    name: 'LoginByCode',
    components: {
        SendEmailCode
    },
    data() {
        return {
            loginForm: {
                email: '',
                code: ''
            },
            loginRules: {
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'change' },
                    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'change' }
                ],
                code: [
                    { required: true, message: '请输入验证码', trigger: 'change' },
                ]
            },
        };
    },
    methods: {
        jump(url) {
            this.$router.replace(url);
        },
        submitLogin() {
            this.$refs.loginForm.validate(async (valid) => {
                if (valid) {
                    const { email, code } = this.loginForm
                    // 调用登录 API，传入邮箱和验证码
                    try {
                        const body = await loginByEmailcode({ "email": email, "emailVerificationCode": code })
                        // 将获取到的 token 存储到本地
                        setToken(body.data)
                        // 跳转到主页
                        this.$router.replace('/')
                    } catch (error) {
                        console.error(error);
                    }
                }
            });
        },
    }
};
</script>