<template>
    <el-button type="primary" @click="handleClick" :disabled="isButtonDisabled" size="large"
        class="send-email-code-btn">
        {{ buttonText }}
    </el-button>
</template>

<script>
import { sendEmailCode } from '@/api/auth';

export default {
    props: {
        email: {
            type: String,
            required: true
        },
        bizType: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            isButtonDisabled: false,
            buttonText: '发送验证码',
            countdown: 60
        };
    },
    methods: {
        async handleClick() {
            if (this.isButtonDisabled) return;

            // 验证邮箱格式
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.email)) {
                this.$message.warning('请输入正确的邮箱格式');
                return;
            }

            try {
                this.startCountdown();
                await sendEmailCode({ email: this.email, bizType: this.bizType });
                this.$message.success('验证码已发送到您的邮箱');
            } catch (error) {
                console.error(error);
                this.$message.error('发送失败，请稍后重试');
                // 如果发送失败，重置按钮状态
                this.resetButton();
            }
        },
        startCountdown() {
            this.isButtonDisabled = true;
            this.countdown = 60;
            this.buttonText = `${this.countdown}秒后重试`;

            const timer = setInterval(() => {
                this.countdown--;
                this.buttonText = `${this.countdown}秒后重试`;

                if (this.countdown <= 0) {
                    clearInterval(timer);
                    this.isButtonDisabled = false;
                    this.buttonText = '发送验证码';
                }
            }, 1000);
        },
        resetButton() {
            this.isButtonDisabled = false;
            this.buttonText = '发送验证码';
            this.countdown = 60;
        }
    }
};
</script>

<style scoped>
.send-email-code-btn {
    min-width: 120px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.send-email-code-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.send-email-code-btn:disabled {
    background: #c0c4cc;
    color: #fff;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.send-email-code-btn:active {
    transform: translateY(0);
}
</style>