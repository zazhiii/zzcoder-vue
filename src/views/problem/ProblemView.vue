<template>
    <div class="problem-container">
        <el-card class="problem-detail">
            <div slot="header">
                <span>{{ problem.title }}</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="jump(`/problem/edit/${problem.id}`)" 
                    v-if="userInfo.roles.includes('admin')">编辑题目</el-button>
            </div>
            <!-- 题目信息 -->
            <div class="problem-info">
                <el-tag v-for="tag in problem.tagNames" :key="tag" style="margin-right: 10px;">{{ tag }}</el-tag>
                <DifficultyTag :difficulty="problem.difficulty" />
            </div>
            <!-- 题目内容 -->
            <div class="problem-content">
                <h3>题目描述</h3>
                <div v-html="problem.description"></div>

                <h3>输入格式</h3>
                <div v-html="problem.inputDescription"></div>

                <h3>输出格式</h3>
                <div v-html="problem.outputDescription"></div>

                <!-- TODO: 样例格式化 -->
                <h3>样例</h3>
                <div v-for="(example, index) in problem.examples" :key="index">
                    <h4>样例 {{ index + 1 }}</h4>
                    <pre>输入: {{ example.input }}</pre>
                    <pre>输出: {{ example.output }}</pre>
                </div>

                <h3>提示</h3>
                <div v-html="problem.hint"></div>
            </div>

            <!-- 提交代码 -->
            <div class="problem-submit">
                <el-button type="primary" @click="submitProblem">提交代码</el-button>
            </div>
            <!-- 代码编辑器 -->
            <div class="code-editor">
                <el-form>
                    <el-form-item label="代码语言">
                        <el-select v-model="language" placeholder="请选择语言" :disabled="!token">
                            <el-option label="C++" value="cpp"></el-option>
                            <el-option label="Java" value="java"></el-option>
                            <el-option label="Python" value="python"></el-option>
                        </el-select>
                        <div v-if="!token" style="color: #F56C6C; font-size: 12px;">请先登录后再选择语言</div>
                    </el-form-item>
                    <el-form-item label="代码">
                        <el-input
                            type="textarea"
                            :rows="10"
                            placeholder="输入代码"
                            v-model="code"
                            :disabled="!token">
                        </el-input>
                        <div v-if="!token" style="color: #F56C6C; font-size: 12px;">请先登录后再编写代码</div>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { getProblemInfo } from '@/api/problem'
import DifficultyTag from './components/difficultyTag.vue'
export default {
    name: 'ProblemView',
    components: {
        DifficultyTag
    },
    computed: {
        userInfo() {
            return this.$store.state.userInfo;
        }
    },
    data() {
        return {
            problem: {
                id: '',
                problemId: '',
                title: '',
                timeLimit: '',
                memoryLimit: '',
                description: '',
                inputDescription: '',
                outputDescription: '',
                examples: [],
                hint: '',
                difficulty: '',
                createUser: '',
                tags: []
            },
            language: 'cpp',
            code: '',
            token: getToken()
        }
    },
    async mounted() {
        await this.fetchProblem();
    },
    methods: {
        async fetchProblem() {
            const id = this.$route.params.id;
            const { data } = await getProblemInfo(id);
            this.problem = data;
        },
        submitProblem() {
            // TODO: 实现提交代码功能
        },
        jump(url) {
            this.$router.replace(url);
        }
    }
}
</script>

<style scoped>
.problem-detail {
    margin-bottom: 20px;
    /* padding: 100px; */
}

.problem-info {
    margin: 20px 0;
}

.problem-content {
    margin: 20px 0;
}

.problem-content h3 {
    margin: 20px 0 10px 0;
}

.problem-content pre {
    background-color: #f5f7fa;
    padding: 10px;
    border-radius: 4px;
}

.problem-submit {
    margin-top: 20px;
    text-align: right;
}
</style>
