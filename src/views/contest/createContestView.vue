<template>
    <div class="contest-container">
        <el-card class="contest-form">
            <div slot="header">
                <span>创建比赛</span>
            </div>
            <el-form :model="contestForm" label-width="120px">
                <el-form-item label="比赛标题">
                    <el-input v-model="contestForm.title"></el-input>
                </el-form-item>

                <el-form-item label="比赛描述">
                    <el-input type="textarea" v-model="contestForm.description" :rows="5"></el-input>
                </el-form-item>

                <el-form-item label="开始时间">
                    <el-date-picker
                        v-model="contestForm.startTime"
                        type="datetime"
                        placeholder="选择开始时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="持续时间(分钟)">
                    <el-input-number v-model="contestForm.duration" :min="1"></el-input-number>
                </el-form-item>

                <el-form-item label="比赛类型">
                    <el-select v-model="contestForm.type" placeholder="请选择比赛类型">
                        <el-option label="公开" :value="0"></el-option>
                        <el-option label="私有" :value="1"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm">创建比赛</el-button>
                    <el-button @click="cancel">取消</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import { createContest } from '@/api/contest'
import { Message } from 'element-ui'

export default {
    name: 'CreateContest',
    data() {
        return {
            contestForm: {
                title: '',
                description: '',
                startTime: '',
                duration: 120,
                visible: 1,
                type: 0,
                password: ''
            }
        }
    },
    methods: {
        async submitForm() {
            try {
                await createContest(this.contestForm)
                Message.success('创建比赛成功')
                this.$router.push('/contest')
            } catch (error) {
                Message.error('创建比赛失败: ' + error.message)
            }
        },
        cancel() {
            this.$router.push('/contest')
        }
    }
}
</script>

<style scoped>
.contest-container {
    padding: 20px;
}
.contest-form {
    max-width: 800px;
    margin: 0 auto;
}
</style>

