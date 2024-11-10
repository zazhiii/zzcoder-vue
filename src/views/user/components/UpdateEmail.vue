<template>
    <div>
        <h1>更新邮箱</h1>
        <el-form :model="form" label-width="80px" :rules="rules" ref="form">
            <el-form-item label="新邮箱" prop="newEmail">
                <el-input v-model="form.newEmail"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="code">
                <el-input v-model="form.code" style="width: 200px;"></el-input>
                <SendEmailCode :email="form.newEmail" style="width: 120px;" />    
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import SendEmailCode from '../../login/components/SendEmailCode.vue'
import { updateEmail } from '@/api/user'

export default {
    name: 'UpdateEmail',
    components: {
        SendEmailCode
    },
    data() {
        return {
            form: {
                newEmail: '',
                code: ''
            },
            rules: {
                newEmail: [
                    { required: true, message: '请输入新邮箱', trigger: 'blur' },
                    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请输入验证码', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        submitForm() {
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    try {
                        await updateEmail({
                            newEmail: this.form.newEmail,
                            emailVerificationCode: this.form.code
                        })
                        this.$message.success('邮箱更新成功');
                    } catch (error) {
                        this.$message.error('邮箱更新失败');
                    }
                }
            });
        }
    }
};
</script>
