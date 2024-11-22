<template>
    <div class="submission-list">

        <el-container>
            <el-main>
                <el-table :data="submissions" style="width: 100%">
                    <!-- 提交id TODO 提交记录详细 -->
                    <el-table-column prop="id" label="ID" width="80">
                        <template #default="scope">
                            <el-link @click="submissionId = scope.row.id; dialogVisible = true">
                                {{ scope.row.id }}
                            </el-link>
                        </template>
                    </el-table-column>
                    <!-- 提交时间 -->
                    <el-table-column prop="submitTime" label="提交时间" width="100">
                        <template #default="scope">
                            {{ new Date(scope.row.submitTime).toLocaleString('zh-CN') }}
                        </template>
                    </el-table-column>
                    <!-- 用户名 TODO 用户主页跳转 -->
                    <el-table-column prop="username" label="用户名" width="100">
                        <template #default="scope">
                            <el-link @click="$router.push(`/user/${scope.row.userId}`)">
                                {{ scope.row.username }}
                            </el-link>
                        </template>
                    </el-table-column>
                    <!-- 题目标题 -->
                    <el-table-column prop="title" label="题目" width="250">
                        <template #default="scope">
                            <el-link @click="$router.push(`/problem/${scope.row.problemId}`)">
                                {{ scope.row.title }}
                            </el-link>
                        </template>
                    </el-table-column>
                    <!-- 语言 -->
                    <el-table-column prop="language" label="语言" width="100" />
                    <!-- 状态 | 结果 -->
                    <el-table-column prop="status" label="状态" width="120">
                        <template #default="scope">
                            <el-tag v-if="scope.row.status != 'Completed'" type="info">
                                {{ scope.row.status }}
                            </el-tag>
                            <el-tag v-else :type="getResultType(scope.row.result)">
                                {{ getResultText(scope.row.result) }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <!-- 耗时 -->
                    <el-table-column prop="timeUsed" label="耗时(ms)" width="100" />
                    <!-- 内存 -->
                    <el-table-column prop="memoryUsed" label="内存(MB)" width="100">
                        <template #default="scope">
                            {{ (scope.row.memoryUsed / 1024).toFixed(2) }}
                        </template>
                    </el-table-column>

                </el-table>
                <!-- 分页组件 -->
                <div class="pagination">
                    <el-pagination :current-page="localQuery.currentPage" :page-size="localQuery.pageSize"
                        :total="total" @current-change="handlePageChange" layout="prev, pager, next" />
                </div>
            </el-main>
            <!-- 条件查询表单 -->
            <el-aside width="200px">
                <el-form :inline="true" :model="localQuery" class="demo-form-inline">
                    <el-form-item label="用户名">
                        <el-input v-model="localQuery.username" placeholder="用户名" clearable />
                    </el-form-item>
                    <el-form-item label="结果">
                        <el-select v-model="localQuery.result" placeholder="结果" clearable>
                            <el-option label="通过" value="AC" />
                            <el-option label="答案错误" value="WA" />
                            <el-option label="超时" value="TLE" />
                            <el-option label="内存超限" value="MLE" />
                            <el-option label="运行错误" value="RE" />
                            <el-option label="编译错误" value="CE" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="语言">
                        <el-select v-model="localQuery.language" placeholder="语言" clearable>
                            <el-option label="C" value="C" />
                            <el-option label="C++" value="cpp" />
                            <el-option label="Java" value="java" />
                            <el-option label="Python" value="python" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="fetchSubmissions">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-aside>
        </el-container>

        <!-- 提交详情对话框 -->
        <el-dialog title="提交详情" :visible.sync="dialogVisible" width="80%">
            <SubmissionInfo :submissionId="submissionId" />
        </el-dialog>
    </div>
</template>

<script>
import { getSubmissions } from '@/api/problem'

export default {
    name: 'SubmissionList',
    props: {
        submissionQuery: {
            type: Object,
            required: true
        },
    },
    components: {
        SubmissionInfo: () => import('./SubmissionInfo')
    },
    data() {
        return {
            total: 0,
            submissions: [],
            dialogVisible: false,
            submissionId: 0,
            localQuery: {
                currentPage: this.submissionQuery.currentPage || 1,
                limit: this.submissionQuery.limit || 10,
                username: this.submissionQuery.username || '',
                result: this.submissionQuery.result || '',
                language: this.submissionQuery.language || '',
                contestId: this.submissionQuery.contestId || ''
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
        handlePageChange(page) {
            this.localQuery.currentPage = page
            this.fetchSubmissions()
        },
        async fetchSubmissions() {
            const { data } = await getSubmissions(this.localQuery)
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
