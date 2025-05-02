<template>
    <div>
        <h1>修改密码</h1>
        <el-form :model="form" label-width="80px" :rules="rules" ref="form">
            <el-form-item label="旧密码" prop="oldPassword">
                <el-input v-model="form.oldPassword" type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="form.newPassword" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="form.confirmPassword" type="password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { updatePassword } from '@/api/auth';
import { removeToken } from '@/utils/cookie';

export default {
    name: 'UpdatePassword',
    data() {
        return {
            form: {
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            },
            rules: {
                oldPassword: [
                    { required: true, message: '请输入旧密码', trigger: 'blur' }
                ],
                newPassword: [
                    { required: true, message: '请���入新密码', trigger: 'blur' },
                    { min: 6, max: 20, message: '新密码长度必须在6到20个字符之间', trigger: 'blur' }
                ],
                confirmPassword: [
                    { required: true, message: '请输入确认密码', trigger: 'blur' },
                    { validator: (rule, value, callback) => {
                        if (value !== this.form.newPassword) {
                            callback(new Error('确认密码与新密码不匹配'));
                        } else {
                            callback();
                        }
                    }, trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        submitForm() {
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    try {
                        await updatePassword({
                            oldPassword: this.form.oldPassword,
                            newPassword: this.form.newPassword
                        })
                        this.$message.success('密码修改成功, 请重新登录');
                        this.$router.replace('/auth');
                        removeToken();
                    } catch (error) {
                        this.$message.error('密码修改失败');
                    }
                }
            });
        }
    }
};
</script>
