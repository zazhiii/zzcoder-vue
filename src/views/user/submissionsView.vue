<template>
    <div class="submission-list">
        <el-table :data="submissions" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="problemId" label="题目ID" width="100" />
            <el-table-column prop="status" label="状态" width="120">
                <template #default="scope">
                    <el-tag v-if="scope.row.status != 'Completed'" type = "info">
                        {{ scope.row.status }}
                    </el-tag>
                    <el-tag v-else :type="getResultType(scope.row.result)">
                        {{ getResultText(scope.row.result) }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="language" label="语言" width="100" />
            <el-table-column prop="timeUsed" label="耗时(ms)" width="120" />
            <el-table-column prop="memoryUsed" label="内存(MB)" width="120">
                <template #default="scope">
                    {{ (scope.row.memoryUsed / 1024).toFixed(2) }}
                </template>
            </el-table-column>
            <el-table-column prop="submitTime" label="提交时间">
                <template #default="scope">
                    {{ new Date(scope.row.submitTime).toLocaleString('zh-CN') }}
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination">
            <el-pagination :current-page="submissionQuery.currentPage" :page-size="submissionQuery.pageSize" :total="total"
                @current-change="handlePageChange" layout="prev, pager, next" />
        </div>
    </div>
</template>

<script>
import { getSubmissions } from '@/api/problem'

export default {
    name: 'SubmissionList',
    data() {
        return {
            submissionQuery: {
                currentPage: 1,
                limit: 10,
                username: '',
                result: '',
                language: '',
                contestId: ''
            },
            total: 0,
            submissions: []
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
        handlePageChange(page) {
            this.submissionQuery.currentPage = page
            this.fetchSubmissions()
        },
        async fetchSubmissions() {
            const { data } = await getSubmissions(this.submissionQuery)
            this.total = data.total
            this.submissions = data.records
        }
    },
    mounted() {
        this.fetchSubmissions()
    }
}
</script>

<style scoped>
.submission-list {
    padding: 20px;
}

.pagination {
    margin-top: 20px;
    text-align: center;
}
</style>
