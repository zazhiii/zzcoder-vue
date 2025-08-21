<template>
    <el-button type="primary" @click="handleClick" :disabled="isButtonDisabled" style="width: 30%; margin-left: 2%;">
        {{ buttonText }}
    </el-button>
</template>

<script>
import { sendEmailVerificationCode } from '@/api/auth';

export default {
    props: {
        email: {
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

            try {
                this.startCountdown();
                await sendEmailVerificationCode({ email: this.email });
            } catch (error) {
                console.error(error);
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
        }
    }
};
</script>