<template>
    <div class="submission-info">
        <el-card>
            <div class="submission-header">
                <h2>提交详情 #{{ submissionId }}</h2>
            </div>

            <el-descriptions :column="2" border>
                <el-descriptions-item label="提交时间">
                    {{ new Date(submission.submitTime).toLocaleString('zh-CN') }}
                </el-descriptions-item>
                <el-descriptions-item label="状态">
                    <el-tag v-if="submission.status != 'Completed'" type="info">
                        {{ submission.status }}
                    </el-tag>
                    <el-tag v-else :type="getResultType(submission.result)">
                        {{ getResultText(submission.result) }}
                    </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="语言">
                    {{ submission.language }}
                </el-descriptions-item>
                <el-descriptions-item label="耗时">
                    {{ submission.timeUsed }} ms
                </el-descriptions-item>
                <el-descriptions-item label="内存">
                    {{ (submission.memoryUsed / 1024).toFixed(2) }} MB
                </el-descriptions-item>
                <el-descriptions-item label="题目">
                    <el-link @click="$router.push(`/problem/${submission.problemId}`)">
                        题目 #{{ submission.problemId }}
                    </el-link>
                </el-descriptions-item>
            </el-descriptions>

            <div class="code-section">
                <h3>提交的代码</h3>
                <el-input
                    type="textarea"
                    :rows="15"
                    v-model="submission.code"
                    readonly>
                </el-input>
            </div>
        </el-card>
    </div>
</template>

<script>
import { getSubmissions } from '@/api/problem'

export default {
    name: 'SubmissionInfo',
    data() {
        return {
            submissionId: this.$route.params.id,
            submission: {
                id: '',
                problemId: '',
                status: '',
                result: '',
                language: '',
                code: '',
                timeUsed: 0,
                memoryUsed: 0,
                submitTime: '',
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
        async fetchSubmissionInfo() {
            const { data } = await getSubmissions({
                id: this.submissionId
            })
            if (data.records && data.records.length > 0) {
                this.submission = data.records[0]
            }
        }
    },
    mounted() {
        this.fetchSubmissionInfo()
    }
}
</script>

<style scoped>
.submission-info {
    padding: 20px;
}

.submission-header {
    margin-bottom: 20px;
}

.code-section {
    margin-top: 20px;
}

.code-section h3 {
    margin-bottom: 10px;
}
</style>
