<template>
    <div class="problem-container">
        <el-card class="problem-form">
            <div slot="header">
                <span>添加题目</span>
            </div>
            <el-form :model="problemForm" label-width="120px">
                <el-form-item label="题目ID">
                    <el-input v-model="problemForm.problemId"></el-input>
                </el-form-item>

                <el-form-item label="题目标题">
                    <el-input v-model="problemForm.title"></el-input>
                </el-form-item>

                <el-form-item label="时间限制(ms)">
                    <el-input-number v-model="problemForm.timeLimit" :min="0"></el-input-number>
                </el-form-item>

                <el-form-item label="空间限制(mb)">
                    <el-input-number v-model="problemForm.memoryLimit" :min="0"></el-input-number>
                </el-form-item>

                <el-form-item label="栈限制(mb)">
                    <el-input-number v-model="problemForm.stackLimit" :min="0"></el-input-number>
                </el-form-item>

                <el-form-item label="题目难度">
                    <el-select v-model="problemForm.difficulty" placeholder="请选择难度">
                        <el-option v-for="item in difficultyOptions" 
                            :key="item.value" 
                            :label="item.label" 
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="题目描述">
                    <el-input type="textarea" v-model="problemForm.description" :rows="5"></el-input>
                </el-form-item>

                <el-form-item label="输入格式">
                    <el-input type="textarea" v-model="problemForm.inputDescription" :rows="3"></el-input>
                </el-form-item>

                <el-form-item label="输出格式">
                    <el-input type="textarea" v-model="problemForm.outputDescription" :rows="3"></el-input>
                </el-form-item>

                <el-form-item label="题目来源">
                    <el-input v-model="problemForm.source"></el-input>
                </el-form-item>

                <el-form-item label="提示">
                    <el-input type="textarea" v-model="problemForm.hint" :rows="3"></el-input>
                </el-form-item>

                <el-form-item label="权限">
                    <el-select v-model="problemForm.status" placeholder="请选择权限">
                        <el-option label="公开" :value="0"></el-option>
                        <el-option label="私有" :value="1"></el-option>
                        <el-option label="比赛中" :value="3"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm">提交</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import { addProblem } from '@/api/problem'

export default {
    name: 'AddProblem',
    data() {
        return {
            problemForm: {
                problemId: 'p1002',
                title: '添加接口测试',
                timeLimit: 1000,
                memoryLimit: 256,
                stackLimit: 128,
                difficulty: 0,
                description: '测试',
                inputDescription: '测试',
                outputDescription: '测试',
                source: '测试',
                hint: '测试',
                status: 0
            },
            difficultyOptions: [{
                value: 0,
                label: '入门'
            }, {
                value: 1,
                label: '简单'
            }, {
                value: 2,
                label: '简单+'
            }, {
                value: 3,
                label: '中等'
            }, {
                value: 4,
                label: '中等+'
            }, {
                value: 5,
                label: '困难'
            }, {
                value: 6,
                label: '困难+'
            }]
        }
    },
    methods: {
        async submitForm() {
            try {
                await addProblem(this.problemForm)
                this.$message.success('添加成功')
                this.$router.replace('/problem')
            } catch (error) {
                this.$message.error('添加失败')
            }
        },
        resetForm() {
            this.problemForm = {
                problemId: 'p1002',
                title: '添加接口测试',
                timeLimit: 1000,
                memoryLimit: 256,
                stackLimit: 128,
                difficulty: 0,
                description: '测试',
                inputDescription: '测试',
                outputDescription: '测试',
                source: '测试',
                hint: '测试',
                status: 0
            }
        }
    }
}
</script>

<style scoped>
.problem-form {
    margin: 20px;
}
</style>
