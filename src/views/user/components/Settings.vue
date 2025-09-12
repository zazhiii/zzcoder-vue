<template>
    <div class="settings-container">
        <el-card class="settings-card" shadow="hover">
            <!-- <div slot="header" class="card-header">
                <h2 class="settings-title">
                    <i class="el-icon-setting"></i>
                    用户设置
                </h2>
            </div> -->

            <el-tabs v-model="activeTab" type="card" class="settings-tabs">
                <!-- 基本设置 -->
                <el-tab-pane name="general">
                    <span slot="label">
                        <i class="el-icon-user"></i>
                        基本设置
                    </span>
                    <div class="tab-content">
                        <el-form :model="generalForm" label-width="120px" class="settings-form">
                            <el-form-item label="Codeforces名称">
                                <el-input v-model="generalForm.cfUsername" placeholder="请输入Codeforces用户名"
                                    style="width: 300px;">
                                </el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="saveGeneral" :loading="generalLoading">
                                    保存基本设置
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>

                <!-- 头像设置 -->
                <el-tab-pane name="avatar">
                    <span slot="label">
                        <i class="el-icon-picture"></i>
                        修改头像
                    </span>
                    <div class="tab-content">
                        <div class="avatar-section">
                            <div class="avatar-upload">
                                <el-upload class="avatar-uploader" action="#" :http-request="uploadAvatar"
                                    :show-file-list="false" :before-upload="beforeAvatarUpload">
                                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                    <div v-else class="avatar-placeholder">
                                        <i class="el-icon-plus"></i>
                                        <p>点击上传头像</p>
                                    </div>
                                </el-upload>
                            </div>
                            <div class="avatar-info">
                                <p class="upload-tips">支持JPG格式，文件大小不超过2MB</p>
                                <el-button type="primary" @click="updateAvatar" :loading="avatarLoading"
                                    :disabled="!imageUrl">
                                    更新头像
                                </el-button>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>

                <!-- 修改密码 -->
                <el-tab-pane name="password">
                    <span slot="label">
                        <i class="el-icon-lock"></i>
                        修改密码
                    </span>
                    <div class="tab-content">
                        <el-form :model="passwordForm" label-width="120px" :rules="passwordRules" ref="passwordForm"
                            class="settings-form">
                            <el-form-item label="当前密码" prop="oldPassword">
                                <el-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入当前密码"
                                    style="width: 300px;" show-password>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="新密码" prop="newPassword">
                                <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码"
                                    style="width: 300px;" show-password>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="确认新密码" prop="confirmPassword">
                                <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码"
                                    style="width: 300px;" show-password>
                                </el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="updatePassword" :loading="passwordLoading">
                                    修改密码
                                </el-button>
                                <el-button @click="resetPasswordForm">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>

                <!-- 修改邮箱 -->
                <el-tab-pane name="email">
                    <span slot="label">
                        <i class="el-icon-message"></i>
                        修改邮箱
                    </span>
                    <div class="tab-content">
                        <el-form :model="emailForm" label-width="120px" :rules="emailRules" ref="emailForm"
                            class="settings-form">
                            <el-form-item label="新邮箱地址" prop="newEmail">
                                <el-input v-model="emailForm.newEmail" placeholder="请输入新邮箱地址" style="width: 300px;">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="邮箱验证码" prop="code">
                                <div class="verification-row">
                                    <el-input v-model="emailForm.code" placeholder="请输入验证码" style="width: 200px;">
                                    </el-input>
                                    <SendEmailCode :email="emailForm.newEmail" class="send-code-btn" />
                                </div>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="updateEmail" :loading="emailLoading">
                                    修改邮箱
                                </el-button>
                                <el-button @click="resetEmailForm">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
import SendEmailCode from '@/views/login/components/SendEmailCode.vue';
import { uploadFile } from '@/api/common';
import { updateUserAvatar, updateEmail, updateUserProfile } from '@/api/user';
import { updatePassword } from '@/api/auth';
import { removeToken } from '@/utils/cookie';
import { mapActions, mapMutations } from "vuex";

export default {
    name: 'UserSettings',
    components: {
        SendEmailCode
    },
    data() {
        return {
            // 当前激活的标签页
            activeTab: 'general',

            // 加载状态
            generalLoading: false,
            avatarLoading: false,
            passwordLoading: false,
            emailLoading: false,

            // 基本设置表单
            generalForm: {
                cfUsername: '',
            },

            // 头像设置
            imageUrl: '',

            // 密码修改表单
            passwordForm: {
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            },

            // 邮箱修改表单
            emailForm: {
                newEmail: '',
                code: ''
            },

            // 密码验证规则
            passwordRules: {
                oldPassword: [
                    { required: true, message: '请输入当前密码', trigger: 'blur' }
                ],
                newPassword: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 6, max: 20, message: '新密码长度必须在6到20个字符之间', trigger: 'blur' }
                ],
                confirmPassword: [
                    { required: true, message: '请输入确认密码', trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            if (value !== this.passwordForm.newPassword) {
                                callback(new Error('确认密码与新密码不匹配'));
                            } else {
                                callback();
                            }
                        }, trigger: 'blur'
                    }
                ]
            },

            // 邮箱验证规则
            emailRules: {
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
        ...mapMutations('user', ['clearUserInfo']),
        ...mapActions('user', ['getUserInfo']),

        // 保存基本设置
        async saveGeneral() {
            this.generalLoading = true;
            try {
                // 这里添加保存基本设置的API调用
                await updateUserProfile(this.generalForm);
                this.$message.success('基本设置保存成功');
            } catch (error) {
                this.$message.error('保存失败，请重试');
            } finally {
                this.generalLoading = false;
            }
        },

        // 头像上传
        async uploadAvatar(options) {
            try {
                const formData = new FormData();
                formData.append('file', options.file);
                this.imageUrl = await uploadFile(formData);
                this.$message.success('头像上传成功');
            } catch (error) {
                this.$message.error('上传头像失败，请重试');
            }
        },

        // 头像上传前验证
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },

        // 更新头像
        async updateAvatar() {
            if (!this.imageUrl) {
                this.$message.warning('请先上传头像');
                return;
            }

            this.avatarLoading = true;
            try {
                await updateUserAvatar(this.imageUrl);
                this.clearUserInfo();
                await this.getUserInfo();
                this.$message.success('头像更新成功');
            } catch (error) {
                this.$message.error('头像更新失败');
            } finally {
                this.avatarLoading = false;
            }
        },

        // 修改密码
        updatePassword() {
            this.$refs.passwordForm.validate(async (valid) => {
                if (valid) {
                    this.passwordLoading = true;
                    try {
                        await updatePassword({
                            oldPassword: this.passwordForm.oldPassword,
                            newPassword: this.passwordForm.newPassword
                        });
                        this.$message.success('密码修改成功，请重新登录');
                        this.$router.replace('/auth');
                        removeToken();
                    } catch (error) {
                        this.$message.error('密码修改失败');
                    } finally {
                        this.passwordLoading = false;
                    }
                }
            });
        },

        // 重置密码表单
        resetPasswordForm() {
            this.$refs.passwordForm.resetFields();
            this.passwordForm = {
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            };
        },

        // 修改邮箱
        updateEmail() {
            this.$refs.emailForm.validate(async (valid) => {
                if (valid) {
                    this.emailLoading = true;
                    try {
                        await updateEmail({
                            newEmail: this.emailForm.newEmail,
                            emailVerificationCode: this.emailForm.code
                        });
                        this.$message.success('邮箱更新成功');
                        this.resetEmailForm();
                    } catch (error) {
                        this.$message.error('邮箱更新失败');
                    } finally {
                        this.emailLoading = false;
                    }
                }
            });
        },

        // 重置邮箱表单
        resetEmailForm() {
            this.$refs.emailForm.resetFields();
            this.emailForm = {
                newEmail: '',
                code: ''
            };
        }
    }
};
</script>

<style scoped>
.settings-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.settings-card {
    border-radius: 8px;
}

.card-header {
    display: flex;
    align-items: center;
}

.settings-title {
    margin: 0;
    font-size: 24px;
    color: #333;
    font-weight: 600;
}

.settings-title i {
    margin-right: 10px;
    color: #409EFF;
}

/* Tab 相关样式 */
.settings-tabs {
    margin-top: 20px;
}

.settings-tabs .el-tabs__header {
    margin-bottom: 20px;
}

.settings-tabs .el-tabs__item {
    font-size: 16px;
    font-weight: 500;
}

.settings-tabs .el-tabs__item i {
    margin-right: 5px;
}

.tab-content {
    padding: 20px 0;
    min-height: 400px;
}

.settings-form {
    /* background-color: #fafafa; */
    padding: 30px;
    border-radius: 8px;
    border: 1px solid #ebeef5;
    max-width: 600px;
}

/* 头像相关样式 */
.avatar-section {
    display: flex;
    align-items: flex-start;
    gap: 40px;
    background-color: #fafafa;
    padding: 40px;
    border-radius: 8px;
    border: 1px solid #ebeef5;
    max-width: 600px;
}

.avatar-upload {
    flex-shrink: 0;
}

.avatar-uploader .el-upload {
    border: 2px dashed #d9d9d9;
    border-radius: 12px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
    width: 160px;
    height: 160px;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
    box-shadow: 0 4px 16px 0 rgba(64, 158, 255, 0.2);
}

.avatar-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #8c939d;
}

.avatar-placeholder i {
    font-size: 36px;
    margin-bottom: 10px;
}

.avatar-placeholder p {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
}

.avatar {
    width: 160px;
    height: 160px;
    display: block;
    object-fit: cover;
    border-radius: 8px;
}

.avatar-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.upload-tips {
    color: #909399;
    font-size: 14px;
    margin: 0 0 20px 0;
    line-height: 1.6;
    background-color: #f5f7fa;
    padding: 12px 16px;
    border-radius: 6px;
    border-left: 4px solid #409EFF;
}

/* 验证码行样式 */
.verification-row {
    display: flex;
    align-items: center;
    gap: 15px;
}

.send-code-btn {
    width: 120px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .settings-container {
        padding: 10px;
    }

    .tab-content {
        padding: 15px 0;
        min-height: 300px;
    }

    .settings-form,
    .avatar-section {
        padding: 20px;
        max-width: 100%;
    }

    .avatar-section {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 20px;
    }

    .verification-row {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
    }

    .send-code-btn {
        width: 100%;
    }

    .settings-form .el-input {
        width: 100% !important;
    }

    .settings-tabs .el-tabs__item {
        font-size: 14px;
        padding: 0 10px;
    }

    .settings-tabs .el-tabs__item span {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 12px;
    }

    .settings-tabs .el-tabs__item i {
        margin-right: 0;
        margin-bottom: 2px;
    }
}

/* 表单美化 */
.el-form-item {
    margin-bottom: 24px;
}

.el-form-item__label {
    font-weight: 500;
    color: #606266;
}

.el-button+.el-button {
    margin-left: 12px;
}

.el-button {
    border-radius: 6px;
    font-weight: 500;
}

.el-input__inner {
    border-radius: 6px;
}

/* Tab内容动画 */
.el-tab-pane {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>