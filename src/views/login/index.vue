<template>
    <el-container class="login-container">
        <el-main class="login-main">
            <el-card class="login-card">
                <!-- 页面头部 -->
                <div class="login-header">
                    <h1 class="login-title">
                        <i class="el-icon-user"></i>
                        欢迎使用ZZCoder
                    </h1>
                    <p class="login-subtitle">在线编程练习平台</p>
                </div>

                <!-- 标签页切换 -->
                <el-tabs v-model="activeTab" class="login-tabs" @tab-click="handleTabClick">
                    <!-- 密码登录 -->
                    <el-tab-pane label="密码登录" name="password">
                        <el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="login-form">
                            <el-form-item prop="username">
                                <el-input v-model="loginForm.username" placeholder="用户名/邮箱/手机号"
                                    prefix-icon="el-icon-user" size="large" clearable />
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input v-model="loginForm.password" type="password" placeholder="密码"
                                    prefix-icon="el-icon-lock" size="large" show-password clearable />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitPasswordLogin" :loading="loading" size="large"
                                    class="login-btn">
                                    <i class="el-icon-key"></i>
                                    登录
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>

                    <!-- 验证码登录 -->
                    <el-tab-pane label="验证码登录" name="code">
                        <el-form :model="codeLoginForm" :rules="codeLoginRules" ref="codeLoginForm" class="login-form">
                            <el-form-item prop="email">
                                <div class="email-input-group">
                                    <el-input v-model="codeLoginForm.email" placeholder="邮箱"
                                        prefix-icon="el-icon-message" size="large" clearable class="email-input" />
                                    <SendEmailCode :email="codeLoginForm.email" :biz-type="'login'" />
                                </div>
                            </el-form-item>
                            <el-form-item prop="code">
                                <el-input v-model="codeLoginForm.code" placeholder="验证码" prefix-icon="el-icon-key"
                                    size="large" clearable />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitCodeLogin" :loading="loading" size="large"
                                    class="login-btn">
                                    <i class="el-icon-message"></i>
                                    登录
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>

                    <!-- 注册 -->
                    <el-tab-pane label="注册" name="register">
                        <el-form :model="registerForm" :rules="registerRules" ref="registerForm" class="login-form">
                            <el-form-item prop="username">
                                <el-input v-model="registerForm.username" placeholder="用户名" prefix-icon="el-icon-user"
                                    size="large" clearable />
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input v-model="registerForm.password" type="password" placeholder="密码"
                                    prefix-icon="el-icon-lock" size="large" show-password clearable />
                            </el-form-item>
                            <el-form-item prop="passwordConfirm">
                                <el-input v-model="registerForm.passwordConfirm" type="password" placeholder="确认密码"
                                    prefix-icon="el-icon-lock" size="large" show-password clearable />
                            </el-form-item>
                            <el-form-item prop="email">
                                <div class="email-input-group">
                                    <el-input v-model="registerForm.email" placeholder="邮箱"
                                        prefix-icon="el-icon-message" size="large" clearable class="email-input" />
                                    <SendEmailCode :email="registerForm.email" :biz-type="'register'" />
                                </div>
                            </el-form-item>
                            <el-form-item prop="emailCode">
                                <el-input v-model="registerForm.emailCode" placeholder="验证码" prefix-icon="el-icon-key"
                                    size="large" clearable />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitRegister" :loading="loading" size="large"
                                    class="login-btn">
                                    <i class="el-icon-user-solid"></i>
                                    注册
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>

                <!-- 底部链接 -->
                <div class="login-footer">
                    <el-divider>
                        <span class="divider-text">其他选项</span>
                    </el-divider>
                    <div class="footer-links">
                        <el-link type="primary" @click="handleForgetPassword">
                            <i class="el-icon-question"></i>
                            忘记密码？
                        </el-link>
                    </div>
                </div>

                <!-- 重置密码对话框 -->
                <el-dialog title="重置密码" :visible.sync="resetPasswordVisible" width="400px" :close-on-click-modal="false"
                    :append-to-body="true" :destroy-on-close="true" :lock-scroll="false" :modal="true"
                    custom-class="reset-password-dialog" @open="handleDialogOpen" @opened="handleDialogOpened">
                    <el-form :model="resetPasswordForm" :rules="resetPasswordRules" ref="resetPasswordForm">
                        <el-form-item prop="email" label="邮箱">
                            <div class="email-input-group">
                                <el-input v-model="resetPasswordForm.email" placeholder="请输入邮箱"
                                    prefix-icon="el-icon-message" clearable class="email-input" />
                                <SendEmailCode :email="resetPasswordForm.email" :biz-type="'reset-password'" />
                            </div>
                        </el-form-item>
                        <el-form-item prop="code" label="验证码">
                            <el-input v-model="resetPasswordForm.code" placeholder="请输入验证码" prefix-icon="el-icon-key"
                                clearable />
                        </el-form-item>
                        <el-form-item prop="newPassword" label="新密码">
                            <el-input v-model="resetPasswordForm.newPassword" type="password" placeholder="请输入新密码"
                                prefix-icon="el-icon-lock" show-password clearable />
                        </el-form-item>
                        <el-form-item prop="confirmPassword" label="确认密码">
                            <el-input v-model="resetPasswordForm.confirmPassword" type="password" placeholder="请确认新密码"
                                prefix-icon="el-icon-lock" show-password clearable />
                        </el-form-item>
                    </el-form>

                    <div slot="footer" class="dialog-footer">
                        <el-button @click="resetPasswordVisible = false">取消</el-button>
                        <el-button type="primary" @click="submitResetPassword" :loading="loading">
                            重置密码
                        </el-button>
                    </div>
                </el-dialog>
            </el-card>
        </el-main>
    </el-container>
</template>

<script>
import { login, loginByEmailcode, register, updatePasswordByEmail } from '@/api/auth'
import { setToken } from '@/utils/cookie'
import { mapMutations } from 'vuex'
import SendEmailCode from './components/SendEmailCode.vue'

export default {
    name: 'LoginView',
    components: {
        SendEmailCode
    },
    data() {
        return {
            activeTab: 'password',
            loading: false,
            resetPasswordVisible: false,

            // 密码登录表单
            loginForm: {
                username: '',
                password: ''
            },
            loginRules: {
                username: [
                    { required: true, message: '请输入用户名/邮箱/手机号', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            },

            // 验证码登录表单
            codeLoginForm: {
                email: '',
                code: ''
            },
            codeLoginRules: {
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'change' },
                    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'change' }
                ],
                code: [
                    { required: true, message: '请输入验证码', trigger: 'change' }
                ]
            },

            // 注册表单
            registerForm: {
                username: '',
                password: '',
                passwordConfirm: '',
                email: '',
                emailCode: ''
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
                    {
                        validator: (rule, value, callback) => {
                            if (value !== this.registerForm.password) {
                                callback(new Error('两次输入的密码不一致'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'change'
                    }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'change' },
                    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'change' }
                ],
                emailCode: [
                    { required: true, message: '请输入验证码', trigger: 'change' }
                ]
            },

            // 重置密码表单
            resetPasswordForm: {
                email: '',
                code: '',
                newPassword: '',
                confirmPassword: ''
            },
            resetPasswordRules: {
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'change' },
                    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'change' }
                ],
                code: [
                    { required: true, message: '请输入验证码', trigger: 'change' }
                ],
                newPassword: [
                    { required: true, message: '请输入新密码', trigger: 'change' },
                    { min: 6, max: 64, message: '密码长度应在6到64个字符之间', trigger: 'change' }
                ],
                confirmPassword: [
                    { required: true, message: '请确认新密码', trigger: 'change' },
                    {
                        validator: (rule, value, callback) => {
                            if (value !== this.resetPasswordForm.newPassword) {
                                callback(new Error('两次输入的密码不一致'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'change'
                    }
                ]
            }
        };
    },
    methods: {
        ...mapMutations('user', ['setLogin']),

        // 标签页切换处理
        handleTabClick(tab, event) {
            console.log(tab, event);
            this.clearForms();
        },

        // 清空所有表单
        clearForms() {
            if (this.$refs.loginForm) {
                this.$refs.loginForm.clearValidate();
            }
            if (this.$refs.codeLoginForm) {
                this.$refs.codeLoginForm.clearValidate();
            }
            if (this.$refs.registerForm) {
                this.$refs.registerForm.clearValidate();
            }
        },

        // 密码登录
        submitPasswordLogin() {
            this.$refs.loginForm.validate(async (valid) => {
                if (valid) {
                    this.loading = true;
                    try {
                        const { username, password } = this.loginForm;
                        const data = await login({
                            identification: username.trim(),
                            password: password
                        });

                        setToken(data);
                        this.setLogin(true);
                        this.$message.success('登录成功！');
                        this.$router.replace('/');
                    } catch (error) {
                        console.error('登录错误:', error);
                        this.$message.error('登录失败，请检查用户名和密码');
                    } finally {
                        this.loading = false;
                    }
                }
            });
        },

        // 验证码登录
        submitCodeLogin() {
            this.$refs.codeLoginForm.validate(async (valid) => {
                if (valid) {
                    this.loading = true;
                    try {
                        const { email, code } = this.codeLoginForm;
                        const body = await loginByEmailcode({
                            email: email,
                            emailCode: code
                        });

                        setToken(body.data);
                        this.setLogin(true);
                        this.$message.success('登录成功！');
                        this.$router.replace('/');
                    } catch (error) {
                        console.error('验证码登录错误:', error);
                        this.$message.error('登录失败，请检查邮箱和验证码');
                    } finally {
                        this.loading = false;
                    }
                }
            });
        },

        // 注册
        submitRegister() {
            this.$refs.registerForm.validate(async (valid) => {
                if (valid) {
                    this.loading = true;
                    try {
                        const { username, password, email, emailCode } = this.registerForm;
                        await register({
                            username,
                            password,
                            email,
                            emailCode
                        });

                        this.$message.success('注册成功！请登录');
                        this.activeTab = 'password';
                        this.clearForms();
                    } catch (error) {
                        console.error('注册错误:', error);
                        this.$message.error('注册失败，请检查输入信息');
                    } finally {
                        this.loading = false;
                    }
                }
            });
        },

        // 忘记密码
        handleForgetPassword() {
            // 延迟显示对话框，确保DOM完全准备好
            this.$nextTick(() => {
                this.resetPasswordVisible = true;
                // 再次使用nextTick确保对话框完全渲染
                this.$nextTick(() => {
                    this.forceDialogZIndex();
                    if (this.$refs.resetPasswordForm) {
                        this.$refs.resetPasswordForm.clearValidate();
                    }
                });
            });
        },

        // 对话框打开时的处理
        handleDialogOpen() {
            this.forceDialogZIndex();
        },

        // 对话框完全打开后的处理
        handleDialogOpened() {
            this.forceDialogZIndex();
        },

        // 强制设置对话框的z-index
        forceDialogZIndex() {
            this.$nextTick(() => {
                // 查找重置密码对话框
                const dialogElement = document.querySelector('.reset-password-dialog');
                const wrapperElement = document.querySelector('.el-dialog__wrapper.reset-password-dialog');
                const modalElement = document.querySelector('.v-modal');

                if (dialogElement) {
                    dialogElement.style.zIndex = '3001';
                }

                if (wrapperElement) {
                    wrapperElement.style.zIndex = '3001';
                    wrapperElement.style.position = 'fixed';
                }

                // 确保蒙层在对话框下方
                if (modalElement) {
                    modalElement.style.zIndex = '3000';
                }

                // 查找所有相关的对话框元素并设置正确的z-index
                const allDialogWrappers = document.querySelectorAll('.el-dialog__wrapper');
                allDialogWrappers.forEach(wrapper => {
                    if (wrapper.querySelector('.reset-password-dialog')) {
                        wrapper.style.zIndex = '3001';
                        wrapper.style.position = 'fixed';
                    }
                });
            });
        },

        // 重置密码
        submitResetPassword() {
            this.$refs.resetPasswordForm.validate(async (valid) => {
                if (valid) {
                    this.loading = true;
                    try {
                        const { email, code, newPassword } = this.resetPasswordForm;
                        await updatePasswordByEmail({
                            email: email,
                            emailCode: code,
                            newPassword: newPassword
                        });

                        this.$message.success('密码重置成功！');
                        this.resetPasswordVisible = false;
                        this.activeTab = 'password';
                        this.resetPasswordForm = {
                            email: '',
                            code: '',
                            newPassword: '',
                            confirmPassword: ''
                        };
                    } catch (error) {
                        console.error('重置密码错误:', error);
                        this.$message.error('重置密码失败，请检查输入信息');
                    } finally {
                        this.loading = false;
                    }
                }
            });
        },

        // 设置全局对话框样式
        setupGlobalDialogStyles() {
            // 创建并注入全局样式
            const style = document.createElement('style');
            style.id = 'reset-password-dialog-styles';
            style.innerHTML = `
                .el-dialog__wrapper.reset-password-dialog {
                    z-index: 3001 !important;
                    position: fixed !important;
                }
                .v-modal {
                    z-index: 3000 !important;
                }
            `;

            // 避免重复添加
            if (!document.getElementById('reset-password-dialog-styles')) {
                document.head.appendChild(style);
            }
        }
    },

    mounted() {
        // 组件挂载后设置全局样式以防止对话框层级问题
        this.setupGlobalDialogStyles();
    }
};
</script>

<style scoped>
.login-container {
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    overflow: hidden;
}

.login-main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 20px;
}

.login-card {
    width: 450px;
    max-width: 95vw;
    padding: 40px 30px;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.95);
}

/* 页面头部 */
.login-header {
    text-align: center;
    margin-bottom: 30px;
}

.login-title {
    font-size: 1.8rem;
    font-weight: 600;
    color: #303133;
    margin: 0 0 8px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.login-title i {
    color: #667eea;
    font-size: 1.6rem;
}

.login-subtitle {
    color: #909399;
    font-size: 0.9rem;
    margin: 0;
}

/* 标签页样式 */
.login-tabs {
    margin-bottom: 20px;
}

.login-tabs ::v-deep .el-tabs__header {
    margin: 0 0 20px 0;
}

.login-tabs ::v-deep .el-tabs__nav-wrap::after {
    display: none;
}

.login-tabs ::v-deep .el-tabs__active-bar {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-tabs ::v-deep .el-tabs__item {
    font-weight: 500;
    color: #909399;
    transition: all 0.3s ease;
}

.login-tabs ::v-deep .el-tabs__item.is-active {
    color: #667eea;
    font-weight: 600;
}

/* 表单样式 */
.login-form {
    margin-top: 20px;
}

.login-form ::v-deep .el-form-item {
    margin-bottom: 20px;
}

.login-form ::v-deep .el-input__inner {
    border: 2px solid #f0f0f0;
    border-radius: 8px;
    padding-left: 45px;
    transition: all 0.3s ease;
}

.login-form ::v-deep .el-input__inner:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.login-form ::v-deep .el-input__prefix {
    left: 15px;
    color: #c0c4cc;
}

.login-form ::v-deep .el-input--large .el-input__inner {
    height: 50px;
}

/* 邮箱输入组合 */
.email-input-group {
    display: flex;
    gap: 10px;
    align-items: flex-start;
}

.email-input {
    flex: 1;
}

.email-input-group ::v-deep .send-email-code-btn {
    height: 50px;
    border-radius: 8px;
    font-weight: 500;
    white-space: nowrap;
}

/* 登录按钮 */
.login-btn {
    width: 100%;
    height: 50px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.login-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.login-btn:active {
    transform: translateY(0);
}

.login-btn i {
    margin-right: 8px;
}

/* 底部区域 */
.login-footer {
    margin-top: 30px;
}

.divider-text {
    color: #c0c4cc;
    font-size: 0.85rem;
    background: rgba(255, 255, 255, 0.95);
    padding: 0 15px;
}

.footer-links {
    text-align: center;
    margin-top: 15px;
}

.footer-links .el-link {
    font-size: 0.9rem;
    font-weight: 500;
}

.footer-links .el-link i {
    margin-right: 5px;
}

/* 重置密码对话框 - 强制设置更高的 z-index */
::v-deep .reset-password-dialog {
    z-index: 3001 !important;
}

::v-deep .reset-password-dialog .el-dialog {
    border-radius: 12px;
    z-index: 3001 !important;
}

::v-deep .reset-password-dialog .el-dialog__wrapper {
    z-index: 3001 !important;
    position: fixed !important;
}

::v-deep .el-dialog__wrapper.reset-password-dialog {
    z-index: 3001 !important;
    position: fixed !important;
}

/* 蒙层样式 */
::v-deep .v-modal {
    z-index: 3000 !important;
}

/* 当重置密码对话框显示时的蒙层 */
.reset-password-dialog ::v-deep .v-modal {
    z-index: 3000 !important;
}

.reset-password-dialog ::v-deep .el-overlay {
    z-index: 3000 !important;
}

.reset-password-dialog ::v-deep .el-overlay-dialog {
    z-index: 3001 !important;
}

.reset-password-dialog ::v-deep .el-dialog__header {
    padding: 25px 25px 15px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px 12px 0 0;
}

.reset-password-dialog ::v-deep .el-dialog__title {
    color: white;
    font-weight: 600;
}

.reset-password-dialog ::v-deep .el-dialog__headerbtn .el-dialog__close {
    color: white;
}

.reset-password-dialog ::v-deep .el-dialog__body {
    padding: 25px;
}

.dialog-footer {
    text-align: right;
}

.dialog-footer .el-button--primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .login-card {
        width: 100%;
        margin: 0 10px;
        padding: 30px 20px;
    }

    .login-title {
        font-size: 1.6rem;
    }

    .email-input-group {
        flex-direction: column;
        gap: 15px;
    }

    .email-input-group ::v-deep .send-email-code-btn {
        width: 100%;
    }
}

/* 动画效果 */
.login-card {
    animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 表单验证错误样式 */
.login-form ::v-deep .el-form-item.is-error .el-input__inner {
    border-color: #f56c6c;
    box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.1);
}

/* 加载状态 */
.login-btn.is-loading {
    pointer-events: none;
}

/* 全局样式覆盖 - 确保重置密码对话框显示正确 */
</style>

<!-- 添加全局样式以确保对话框正确显示 -->
<style>
/* 全局强制样式 - 不使用scoped */
.el-dialog__wrapper.reset-password-dialog {
    z-index: 3001 !important;
    position: fixed !important;
}

.el-dialog__wrapper.reset-password-dialog .el-dialog {
    z-index: 3001 !important;
}

.el-dialog__wrapper.reset-password-dialog~.v-modal {
    z-index: 3000 !important;
}

/* 当有重置密码对话框时，确保蒙层层级正确 */
body:has(.reset-password-dialog) .v-modal {
    z-index: 3000 !important;
}

/* 针对Element UI的对话框包装器 */
.el-dialog__wrapper:has(.reset-password-dialog) {
    z-index: 3001 !important;
}
</style>
