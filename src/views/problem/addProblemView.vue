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

                <el-form-item label="题目标签">
                    <el-select v-model="problemForm.tagIds" multiple placeholder="请选择标签">
                        <el-option v-for="tag in tags" 
                            :key="tag.id" 
                            :label="tag.name" 
                            :value="tag.id">
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

                <el-form-item label="样例">
                    <div v-for="(example, index) in problemForm.examples" :key="index" class="example-item">
                        <el-input placeholder="输入" v-model="example.input" type="textarea" :rows="2"></el-input>
                        <el-input placeholder="输出" v-model="example.output" type="textarea" :rows="2"></el-input>
                        <el-button type="danger" @click="removeExample(index)" size="small">删除样例</el-button>
                    </div>
                    <el-button type="primary" @click="addExample" size="small">添加样例</el-button>
                </el-form-item>

                <el-form-item label="题目来源">
                    <el-input v-model="problemForm.source"></el-input>
                </el-form-item>

                <el-form-item label="提示">
                    <el-input type="textarea" v-model="problemForm.hint" :rows="3"></el-input>
                </el-form-item>

                <el-form-item label="权限">
                    <el-select v-model="problemForm.status" placeholder="请选择权限">
                        <el-option label="公开" value="0"></el-option>
                        <el-option label="私有" value="1"></el-option>
                        <el-option label="比赛中" value="3"></el-option>
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
import { getTagList } from '@/api/problem'
import { addProblem } from '@/api/problem'

export default {
    name: 'AddProblem',
    data() {
        return {
            problemForm: {
                problemId: '',
                title: '',
                timeLimit: 1000,
                memoryLimit: 256,
                stackLimit: 128,
                difficulty: '',
                tagIds: [],
                description: '',
                inputDescription: '',
                outputDescription: '',
                examples: [{
                    input: '',
                    output: ''
                }],
                source: 'zzcoder',
                hint: '',
                status: '0'
            },
            tags: [],
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
    async mounted() {
        await this.fetchTags()
    },
    methods: {
        async fetchTags() {
            const { data } = await getTagList()
            this.tags = data
        },
        addExample() {
            this.problemForm.examples.push({
                input: '',
                output: ''
            })
        },
        removeExample(index) {
            this.problemForm.examples.splice(index, 1)
        },
        async submitForm() {
            this.problemForm.examples = JSON.stringify(this.problemForm.examples)
            await addProblem(this.problemForm)
            this.$router.replace('/problem')
            this.$message.success('添加成功')
        },
        resetForm() {
            this.problemForm = {
                problemId: '',
                title: '',
                timeLimit: 1000,
                memoryLimit: 256,
                stackLimit: 128,
                difficulty: '',
                tagIds: [],
                description: '',
                inputDescription: '',
                outputDescription: '',
                examples: [{
                    input: '',
                    output: ''
                }],
                source: 'zzcoder',
                hint: '',
                status: '0'
            }
        }
    }
}
</script>

<style scoped>
.problem-form {
    margin: 20px;
}
.example-item {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
}
.example-item .el-input {
    margin-bottom: 10px;
}
</style>
