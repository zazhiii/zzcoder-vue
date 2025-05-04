<template>
    <div class="submission-info">
        <el-descriptions :column="2" border>
            <el-descriptions-item label="提交ID">{{ submission.id }}</el-descriptions-item>
            <el-descriptions-item label="提交时间">{{ new Date(submission.submitTime).toLocaleString('zh-CN') }}</el-descriptions-item>
            <el-descriptions-item label="用户">
                <el-link @click="$router.push(`/user/${submission.userId}`)">{{ submission.username }}</el-link>
            </el-descriptions-item>
            <el-descriptions-item label="题目">
                <el-link @click="$router.push(`/problem/${submission.problemId}`)">{{ submission.title }}</el-link>
            </el-descriptions-item>
            <el-descriptions-item label="语言">{{ submission.language }}</el-descriptions-item>
            <el-descriptions-item label="状态">
                <!-- <el-tag v-if="submission.status != 'Completed'" type="info">{{ submission.status }}</el-tag> -->
                <el-tag :type="getResultType(submission.status)">{{ getResultText(submission.status) }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="耗时">{{ submission.timeUsed }}ms</el-descriptions-item>
            <el-descriptions-item label="内存">{{ submission.memoryUsed }}MB</el-descriptions-item>
            <el-descriptions-item v-if="submission.status != 'AC'" label="错误信息"> TODO </el-descriptions-item>
        </el-descriptions>

        <div class="code-section">
            <h3>代码</h3>
            <pre><code>{{ submission.code }}</code></pre>
        </div>
    </div>
</template>

<script>
import { getSubmissionInfo } from '@/api/problem'

export default {
    name: 'SubmissionInfo',
    props: {
        submissionId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            submission: {
                id: 0,
                submitTime: '',
                userId: '',
                username: '',
                problemId: '',
                title: '',
                language: '',
                status: '',
                result: '',
                timeUsed: 0,
                memoryUsed: 0,
                code: ''
            }
        }
    },
    methods: {
        getResultType(result) {
            const statusMap = {
                'AC': 'success',
                'WA': 'danger',
                'TLE': 'warning',
                'MLE': 'warning',
                'RE': 'danger',
                'CE': 'info',
                'PE': 'warning'
            }
            return statusMap[result] || 'info'
        },
        getResultText(result) {
            const statusTextMap = {
                'AC': '通过',
                'WA': '答案错误',
                'TLE': '超时',
                'MLE': '内存超限',
                'RE': '运行错误',
                'CE': '编译错误',
                'PE': '格式错误'
            }
            return statusTextMap[result] || '未知'
        },
        async fetchSubmission() {
            const { data } = await getSubmissionInfo(this.submissionId)
            this.submission = data
        }
    },
    watch: {
        submissionId: {
            immediate: true,
            handler() {
                this.fetchSubmission()
            }
        }
    }
}
</script>

<style scoped>
.submission-info {
    padding: 20px;
}

.code-section {
    margin-top: 20px;
}

.code-section pre {
    background-color: #f5f7fa;
    padding: 15px;
    border-radius: 4px;
    overflow-x: auto;
}
</style>
