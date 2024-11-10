<template>
    <el-form :model="resetPasswordForm" :rules="resetPasswordRules" ref="resetPasswordForm">
        <h1 style="text-align: center; margin-bottom: 20px;">重置密码</h1>
        <el-form-item prop="email">
            <el-input v-model="resetPasswordForm.email" placeholder="邮箱" style="width: 68%;"></el-input>
            <SendEmailCode :email="resetPasswordForm.email" />
        </el-form-item>
        <el-form-item prop="code">
            <el-input v-model="resetPasswordForm.code" placeholder="验证码"></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input v-model="resetPasswordForm.password" type="password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item prop="repeatPassword">
            <el-input v-model="resetPasswordForm.passwordConfirm" type="password" placeholder="再次输入密码"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitResetPassword" style="width: 100%;">重置密码</el-button>
        </el-form-item>
        <el-form-item>
            <el-link type="primary" style="float: left;" @click="jump('/auth/login-by-password')">返回登录</el-link>
        </el-form-item>
    </el-form>
</template>

<script>
import SendEmailCode from './components/SendEmailCode.vue'
import { updatePasswordByEmail } from '@/api/auth'
export default {
    name: 'ResetPasswordView',
    components: {
        SendEmailCode
    },
    data() {
        return {
            resetPasswordForm: {
                password: '',
                passwordConfirm: '',
                email: '',
                code: ''
            },
            resetPasswordRules: {
                password: [
                    { required: true, message: '请输入密码', trigger: 'change' },
                    { min: 6, max: 64, message: '密码长度应在6到64个字符之间', trigger: 'change' }
                ],
                passwordConfirm: [
                    { required: true, message: '请再次输入密码', trigger: 'change' },
                    { validator: (rule, value, callback) => {
                        if (value !== this.resetPasswordForm.password) {
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
            },
        };
    },
    methods: {
        jump(url) {
            this.$router.replace(url);
        },
        async submitResetPassword() {
            this.$refs.resetPasswordForm.validate(async (valid) => {
                if (valid) {
                    try{
                        const { email, code, password } = this.resetPasswordForm
                        await updatePasswordByEmail({ email, emailVerificationCode: code, newPassword: password })
                        this.$message.success('密码重置成功，请重新登录')
                        this.$router.replace('/auth/login-by-password')    
                    }catch(error){
                        console.error(error);
                    }
                }
            });
        },
    }
};
</script>