<!-- TODO: 编辑题目页面 -->
<template>
    <div class="edit-problem-container">
        <el-card class="edit-problem-form">
            <div slot="header">
                <span>编辑题目</span>
            </div>

            <el-form :model="problemForm" label-width="100px">
                <el-form-item label="题目标题">
                    <el-input v-model="problemForm.title"></el-input>
                </el-form-item>

                <el-form-item label="题目难度">
                    <el-select v-model="problemForm.difficulty">
                        <el-option v-for="item in difficultyOptions" 
                            :key="item.value" 
                            :label="item.label" 
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="添加标签">
                    <el-select v-model="selectedTags" placeholder="选择标签" multiple>
                        <el-option v-for="tag in availableTags" 
                            :key="tag.id"
                            :label="tag.name"
                            :value="tag">
                        </el-option>
                    </el-select>
                </el-form-item>
                
                <el-form-item label="题目标签">
                    <div class="selected-tags">
                        <el-tag v-for="tag in problemForm.tags" :key="tag.id" closable @close="removeTag(tag.id)">
                            {{ tag.name }}
                        </el-tag>
                    </div>
                </el-form-item>

                <el-form-item label="题目描述">
                    <el-input type="textarea" v-model="problemForm.description" rows="6"></el-input>
                </el-form-item>

                <el-form-item label="输入描述">
                    <el-input type="textarea" v-model="problemForm.inputDescription" rows="4"></el-input>
                </el-form-item>

                <el-form-item label="输出描述">
                    <el-input type="textarea" v-model="problemForm.outputDescription" rows="4"></el-input>
                </el-form-item>

                <el-form-item label="样例">
                    <div v-for="(example, index) in problemForm.examples" :key="index" class="example-item">
                        <el-input v-model="example.input" placeholder="输入样例" type="textarea" rows="2"></el-input>
                        <el-input v-model="example.output" placeholder="输出样例" type="textarea" rows="2"></el-input>
                        <el-button type="danger" @click="removeExample(index)" size="small">删除样例</el-button>
                    </div>
                    <el-button type="primary" @click="addExample" size="small">添加样例</el-button>
                </el-form-item>

                <el-form-item label="提示">
                    <el-input type="textarea" v-model="problemForm.hint" rows="4"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm">保存修改</el-button>
                    <el-button @click="cancel">取消</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import { getProblemInfo, updateProblem, getTagList } from '@/api/problem'

export default {
    name: 'EditProblemView',
    data() {
        return {
            problemForm: {
                id: '',
                title: '',
                description: '',
                inputDescription: '',
                outputDescription: '',
                examples: [],
                hint: '',
                difficulty: '',
                tags: []
            },
            selectedTag: null,
            availableTags: [],
            difficultyOptions: [{
                value: '0',
                label: '入门'
            }, {
                value: '1',
                label: '简单'
            }, {
                value: '2',
                label: '简单+'
            }, {
                value: '3',
                label: '中等'
            }, {
                value: '4',
                label: '中等+'
            }, {
                value: '5',
                label: '困难'
            }, {
                value: '6',
                label: '困难+'
            }]
        }
    },
    async mounted() {
        await this.fetchTags()
        await this.fetchProblem()
    },
    methods: {
        async fetchProblem() {
            const id = this.$route.params.id
            const { data } = await getProblemInfo(id)
            this.problemForm = data
        },
        async fetchTags() {
            const { data } = await getTagList()
            this.availableTags = data
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
            try {
                await updateProblem(this.problemForm)
                this.$message.success('题目更新成功')
                this.$router.push(`/problem/${this.problemForm.id}`)
            } catch (error) {
                this.$message.error('题目更新失败')
            }
        },
        cancel() {
            this.$router.push(`/problem/${this.problemForm.id}`)
        },
        removeTag(tagId) {
            const index = this.problemForm.tags.indexOf(tagId)
            if (index !== -1) {
                this.problemForm.tags.splice(index, 1)
            }
        },
        getTagName(tagId) {
            const tag = this.availableTags.find(t => t.id === tagId)
            return tag ? tag.name : ''
        }
    }
}
</script>

<style scoped>
.edit-problem-container {
    padding: 20px;
}

.edit-problem-form {
    max-width: 1000px;
    margin: 0 auto;
}

.example-item {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
}

.example-item .el-input {
    margin-bottom: 10px;
}

.selected-tags {
    margin-top: 10px;
}

.selected-tags .el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
}
</style>
