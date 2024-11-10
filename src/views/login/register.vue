<template>
    <el-form :model="registerForm" :rules="registerRules" ref="registerForm">
        <h1 style="text-align: center; margin-bottom: 20px;">注册</h1>
        <el-form-item prop="username">
            <el-input v-model="registerForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input v-model="registerForm.password" type="password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item prop="passwordConfirm">
            <el-input v-model="registerForm.passwordConfirm" type="password" placeholder="确认密码"></el-input>
        </el-form-item>
        <el-form-item prop="email">
            <el-input v-model="registerForm.email" placeholder="邮箱" style="width: 68%;"></el-input>
            <SendEmailCode :email="registerForm.email" />
        </el-form-item>
        <el-form-item prop="emailVerificationCode">
            <el-input v-model="registerForm.emailVerificationCode" placeholder="验证码"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitRegister" style="width: 100%;">注册</el-button>
        </el-form-item>
        <el-form-item>
            <el-link type="primary" style="float: left;" @click="jump('/auth/login-by-password')">登录</el-link>
        </el-form-item>
    </el-form>
</template>

<script>
import {register} from '@/api/auth'
import SendEmailCode from './components/SendEmailCode.vue'

export default {
    name: 'RegisterView',
    components: {
        SendEmailCode
    },
    data() {
        return {
            registerForm: {
                username: '',
                password: '',
                passwordConfirm: '',
                email: '',
                emailVerificationCode: ''
            },
            registerRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'change' },
                    { min: 3, max: 32, message: '用户名长度应在3到32个字符之间', trigger: 'change' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'change' },
                    { min: 6, max: 64, message: '密码长度应在6到64个字符之间', trigger: 'change' }
                ],
                passwordConfirm: [
                    { required: true, message: '请输入确认密码', trigger: 'change' },
                    { validator: (rule, value, callback) => {
                        if (value !== this.registerForm.password) {
                            callback(new Error('两次输入的密码不一致'));
                        } else {
                            callback();
                        }
                    }, trigger: 'change' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'change' },
                    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'change' }
                ],
                emailVerificationCode: [
                    { required: true, message: '请输入验证码', trigger: 'change' }
                ]
            }
        };
    },
    methods: {
        jump(url) {
            this.$router.replace(url);
        },
        submitRegister() {
            this.$refs.registerForm.validate(async (valid) => {
                if (valid) {
                    try {
                        const { username, password, email, emailVerificationCode } = this.registerForm
                        await register({ username, password, email, emailVerificationCode })
                        this.$message.success('注册成功！')
                        this.$router.replace('/auth/login-by-password')
                    } catch (error) {
                        console.error(error);
                    }
                }
            });
        },
    }
};
</script>