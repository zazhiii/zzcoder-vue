<template>
    <div class="submission-list">
        <el-table :data="submissions" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="problemId" label="题目ID" width="100" />
            <el-table-column prop="status" label="状态" width="120">
                <template #default="scope">
                    <el-tag :type="getStatusType(scope.row.status)">
                        {{ getStatusText(scope.row.status) }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="language" label="语言" width="100" />
            <el-table-column prop="time" label="耗时(ms)" width="120" />
            <el-table-column prop="memory" label="内存(MB)" width="120" />
            <el-table-column prop="createTime" label="提交时间" />
        </el-table>

        <div class="pagination">
            <el-pagination :current-page="currentPage" :page-size="pageSize" :total="total"
                @current-change="handlePageChange" layout="prev, pager, next" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'SubmissionList',
    data() {
        return {
            submissions: [],
            currentPage: 1,
            pageSize: 10,
            total: 0
        }
    },
    methods: {
        getStatusType(status) {
            const statusMap = {
                'AC': 'success',
                'WA': 'danger',
                'TLE': 'warning',
                'MLE': 'warning',
                'RE': 'danger',
                'CE': 'info',
                'PE': 'warning'
            }
            return statusMap[status] || 'info'
        },
        getStatusText(status) {
            const statusTextMap = {
                'AC': '通过',
                'WA': '答案错误',
                'TLE': '超时',
                'MLE': '内存超限',
                'RE': '运行错误',
                'CE': '编译错误',
                'PE': '格式错误'
            }
            return statusTextMap[status] || '未知'
        },
        handlePageChange(page) {
            this.currentPage = page
            this.fetchSubmissions()
        },
        async fetchSubmissions() {
            // TODO: 调用API获取提交记录列表
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
