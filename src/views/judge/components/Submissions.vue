<template>
    <div class="submission-list">
        <!-- 页面头部 -->
        <!-- <div class="page-header">
            <h1 class="page-title">
                <i class="el-icon-document"></i>
                提交记录
            </h1>
            <p class="page-subtitle">查看所有代码提交记录和执行结果</p>
        </div> -->

        <!-- 筛选和搜索区域 -->
        <el-card class="filter-card" shadow="never">
            <div class="filter-header">
                <h3>筛选条件</h3>
                <el-button type="text" @click="resetFilters" class="reset-btn">
                    <i class="el-icon-refresh"></i>
                    重置
                </el-button>
            </div>

            <el-form :inline="true" :model="localQuery" class="filter-form">
                <el-row :gutter="16">
                    <el-col :xs="24" :sm="12" :md="6">
                        <el-form-item label="用户名">
                            <el-input v-model="localQuery.username" placeholder="输入用户名" clearable
                                prefix-icon="el-icon-user" />
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="6">
                        <el-form-item label="判题结果">
                            <JudgeResultSelect v-model="localQuery.status" placeholder="选择判题结果"
                                :include-system-status="true" />
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="6">
                        <el-form-item label="编程语言">
                            <el-select v-model="localQuery.language" placeholder="选择语言" clearable style="width: 100%">
                                <el-option label="C" value="C">
                                    <span class="language-option">
                                        <i class="language-icon c-icon"></i>
                                        C
                                    </span>
                                </el-option>
                                <el-option label="C++" value="cpp">
                                    <span class="language-option">
                                        <i class="language-icon cpp-icon"></i>
                                        C++
                                    </span>
                                </el-option>
                                <el-option label="Java" value="java">
                                    <span class="language-option">
                                        <i class="language-icon java-icon"></i>
                                        Java
                                    </span>
                                </el-option>
                                <el-option label="Python" value="python">
                                    <span class="language-option">
                                        <i class="language-icon python-icon"></i>
                                        Python
                                    </span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="6">
                        <el-form-item>
                            <el-button type="primary" @click="fetchSubmissions" :loading="loading" class="search-btn">
                                <i class="el-icon-search"></i>
                                查询
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>

        <!-- 数据表格 -->
        <el-card class="table-card" shadow="never">
            <div class="table-header">
                <div class="table-info">
                    <span class="total-count">
                        共 <strong>{{ total }}</strong> 条提交记录
                    </span>
                </div>
                <div class="table-actions">
                    <el-button size="small" @click="fetchSubmissions" :loading="loading">
                        <i class="el-icon-refresh"></i>
                        刷新
                    </el-button>
                </div>
            </div>

            <el-table :data="submissions" style="width: 100%" v-loading="loading" stripe class="submissions-table">
                <!-- 提交ID -->
                <el-table-column prop="id" label="ID" width="80" align="center">
                    <template #default="scope">
                        <el-link @click="openSubmissionDetail(scope.row.id)" class="submission-id-link">
                            #{{ scope.row.id }}
                        </el-link>
                    </template>
                </el-table-column>

                <!-- 提交时间 -->
                <el-table-column prop="submitTime" label="提交时间" width="160" align="center">
                    <template #default="scope">
                        <div class="time-column">
                            <div class="time-main">{{ formatTime(scope.row.submitTime) }}</div>
                            <div class="time-relative">{{ getRelativeTime(scope.row.submitTime) }}</div>
                        </div>
                    </template>
                </el-table-column>

                <!-- 用户名 -->
                <el-table-column prop="username" label="用户" width="120" align="center">
                    <template #default="scope">
                        <div class="user-column">
                            <el-avatar :size="32" class="user-avatar">
                                <i class="el-icon-user-solid"></i>
                            </el-avatar>
                            <el-link @click="$router.push(`/user/${scope.row.userId}`)" class="username-link">
                                {{ scope.row.username }}
                            </el-link>
                        </div>
                    </template>
                </el-table-column>

                <!-- 题目 -->
                <el-table-column prop="title" label="题目" min-width="200">
                    <template #default="scope">
                        <div class="problem-column">
                            <el-link @click="$router.push(`/problem/${scope.row.problemId}`)" class="problem-title">
                                {{ scope.row.title }}
                            </el-link>
                            <div class="problem-id">题目 #{{ scope.row.problemId }}</div>
                        </div>
                    </template>
                </el-table-column>

                <!-- 语言 -->
                <el-table-column prop="language" label="语言" width="100" align="center">
                    <template #default="scope">
                        <el-tag :type="getLanguageType(scope.row.language)" size="small" effect="light"
                            class="language-tag">
                            <i :class="getLanguageIcon(scope.row.language)"></i>
                            {{ scope.row.language }}
                        </el-tag>
                    </template>
                </el-table-column>

                <!-- 状态 -->
                <el-table-column prop="status" label="判题结果" width="120" align="center">
                    <template #default="scope">
                        <el-tag :type="getResultType(scope.row.status)" size="small" effect="dark" class="status-tag">
                            {{ getResultText(scope.row.status) }}
                        </el-tag>
                    </template>
                </el-table-column>

                <!-- 耗时 -->
                <el-table-column prop="timeUsed" label="耗时" width="100" align="center">
                    <template #default="scope">
                        <span v-if="scope.row.timeUsed" class="time-used">
                            {{ scope.row.timeUsed }}ms
                        </span>
                        <span v-else class="no-data">-</span>
                    </template>
                </el-table-column>

                <!-- 内存 -->
                <el-table-column prop="memoryUsed" label="内存" width="100" align="center">
                    <template #default="scope">
                        <span v-if="scope.row.memoryUsed" class="memory-used">
                            {{ formatMemory(scope.row.memoryUsed) }}
                        </span>
                        <span v-else class="no-data">-</span>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 空状态 -->
            <div v-if="!loading && submissions.length === 0" class="empty-state">
                <i class="el-icon-document-remove"></i>
                <h3>暂无提交记录</h3>
                <p>当前筛选条件下没有找到提交记录</p>
                <el-button type="primary" @click="resetFilters">
                    清除筛选条件
                </el-button>
            </div>

            <!-- 分页 -->
            <div class="pagination-wrapper" v-if="total > 0">
                <el-pagination :current-page="localQuery.page" :page-size="localQuery.pageSize" :total="total"
                    @current-change="handlePageChange" @size-change="handleSizeChange" :page-sizes="[10, 20, 50, 100]"
                    layout="total, sizes, prev, pager, next, jumper" class="submission-pagination" />
            </div>
        </el-card>

        <!-- 提交详情对话框 -->
        <el-dialog title="提交详情" :visible.sync="dialogVisible" width="90%" top="5vh" :close-on-click-modal="false"
            class="submission-dialog">
            <SubmissionInfo :submissionId="submissionId" />
        </el-dialog>
    </div>
</template>

<script>
import { pageSubmission } from '@/api/judge'
import JudgeResultSelect from '@/components/JudgeResultSelect.vue'
import { getResultType, getResultText } from '@/utils/judgeResult'

export default {
    name: 'SubmissionList',
    props: {
        submissionQuery: {
            type: Object,
            required: true
        },
    },
    components: {
        SubmissionInfo: () => import('./SubmissionInfo'),
        JudgeResultSelect
    },
    data() {
        return {
            total: 0,
            submissions: [],
            dialogVisible: false,
            submissionId: 0,
            loading: false,
            localQuery: {
                page: this.submissionQuery.page || 1,
                pageSize: this.submissionQuery.pageSize || 20,
                problemId: this.submissionQuery.problemId || '',
                username: this.submissionQuery.username || '',
                status: this.submissionQuery.status || '',
                language: this.submissionQuery.language || '',
                contestId: this.submissionQuery.contestId || ''
            }
        }
    },
    methods: {
        // 直接使用工具函数
        getResultType,
        getResultText,

        getLanguageType(language) {
            const languageTypeMap = {
                'C': 'info',
                'cpp': 'primary',
                'java': 'warning',
                'python': 'success'
            }
            return languageTypeMap[language] || 'info'
        },

        getLanguageIcon(language) {
            const iconMap = {
                'C': 'language-icon c-icon',
                'cpp': 'language-icon cpp-icon',
                'java': 'language-icon java-icon',
                'python': 'language-icon python-icon'
            }
            return iconMap[language] || 'el-icon-code'
        },

        formatTime(timeString) {
            const date = new Date(timeString);
            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        },

        getRelativeTime(timeString) {
            const date = new Date(timeString);
            const now = new Date();
            const diff = now - date;
            const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
            const diffHours = Math.floor(diff / (1000 * 60 * 60));
            const diffMinutes = Math.floor(diff / (1000 * 60));

            if (diffDays > 0) {
                return `${diffDays}天前`;
            } else if (diffHours > 0) {
                return `${diffHours}小时前`;
            } else if (diffMinutes > 0) {
                return `${diffMinutes}分钟前`;
            } else {
                return '刚刚';
            }
        },

        formatMemory(memory) {
            if (memory === null || memory === undefined) return '-';
            if (memory < 1024) {
                return `${memory}KB`;
            } else {
                return `${(memory / 1024).toFixed(2)}MB`;
            }
        },

        handlePageChange(page) {
            this.localQuery.page = page;
            this.fetchSubmissions();
        },

        handleSizeChange(size) {
            this.localQuery.pageSize = size;
            this.localQuery.page = 1;
            this.fetchSubmissions();
        },

        resetFilters() {
            this.localQuery = {
                page: 1,
                pageSize: 20,
                problemId: this.submissionQuery.problemId || '',
                username: '',
                status: '',
                language: '',
                contestId: this.submissionQuery.contestId || ''
            };
            this.fetchSubmissions();
        },

        openSubmissionDetail(id) {
            this.submissionId = id;
            this.dialogVisible = true;
        },

        async fetchSubmissions() {
            this.loading = true;
            try {
                const data = await pageSubmission(this.localQuery);
                this.total = data.total;
                this.submissions = data.records || [];
            } catch (error) {
                console.error('获取提交记录失败:', error);
                this.$message.error('获取提交记录失败');
                this.submissions = [];
                this.total = 0;
            } finally {
                this.loading = false;
            }
        }
    },

    mounted() {
        this.fetchSubmissions();
    },

    watch: {
        submissionQuery: {
            handler(newQuery) {
                this.localQuery = {
                    ...this.localQuery,
                    ...newQuery
                };
                this.fetchSubmissions();
            },
            deep: true
        }
    }
}
</script>

<style scoped>
.submission-list {
    padding: 20px;
    /* max-width: 1400px; */
    margin: 0 auto;
    background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
    min-height: calc(100vh - 120px);
}

/* 页面头部 */
.page-header {
    margin-bottom: 24px;
    text-align: center;
}

.page-title {
    font-size: 2.2rem;
    font-weight: 600;
    color: #303133;
    margin: 0 0 8px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
}

.page-title i {
    color: #409EFF;
    font-size: 2rem;
}

.page-subtitle {
    color: #606266;
    margin: 0;
    font-size: 1rem;
}

/* 筛选卡片 */
.filter-card {
    margin-bottom: 20px;
    border-radius: 12px;
    border: none;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f2f5;
}

.filter-header h3 {
    margin: 0;
    color: #303133;
    font-size: 1.1rem;
    font-weight: 600;
}

.reset-btn {
    color: #909399;
    transition: all 0.3s ease;
}

.reset-btn:hover {
    color: #409EFF;
}

.filter-form {
    margin: 0;
}

.filter-form .el-form-item {
    margin-bottom: 12px;
}

.filter-form .el-form-item__label {
    font-weight: 500;
    color: #606266;
}

.language-option {
    display: flex;
    align-items: center;
    gap: 8px;
}

.language-icon {
    width: 12px;
    height: 12px;
    border-radius: 2px;
}

.c-icon {
    background-color: #555555;
}

.cpp-icon {
    background-color: #00599C;
}

.java-icon {
    background-color: #ED8B00;
}

.python-icon {
    background-color: #3776ab;
}

.search-btn {
    width: 100%;
}

/* 表格卡片 */
.table-card {
    border-radius: 12px;
    border: none;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f2f5;
}

.table-info .total-count {
    color: #606266;
    font-size: 0.9rem;
}

.table-info strong {
    color: #409EFF;
    font-weight: 600;
}

/* 表格样式 */
.submissions-table {
    border-radius: 8px;
    overflow: hidden;
}

.submissions-table>>>.el-table__header {
    background-color: #f8f9fa;
}

.submissions-table>>>.el-table th {
    background-color: #f8f9fa;
    color: #606266;
    font-weight: 600;
    border-bottom: 1px solid #e4e7ed;
}

.submissions-table>>>.el-table tr:hover>td {
    background-color: #f8f9ff;
}

.submissions-table>>>.el-table td {
    border-bottom: 1px solid #f0f2f5;
}

/* 表格列样式 */
.submission-id-link {
    font-weight: 600;
    color: #409EFF;
    text-decoration: none;
}

.time-column {
    text-align: center;
}

.time-main {
    font-size: 0.9rem;
    color: #303133;
    font-weight: 500;
}

.time-relative {
    font-size: 0.8rem;
    color: #909399;
    margin-top: 2px;
}

.user-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
}

.user-avatar {
    border: 2px solid #e4e7ed;
}

.username-link {
    font-size: 0.9rem;
    font-weight: 500;
    color: #303133;
    text-decoration: none;
}

.username-link:hover {
    color: #409EFF;
}

.problem-column {
    line-height: 1.4;
}

.problem-title {
    color: #303133;
    font-weight: 500;
    text-decoration: none;
    display: block;
    margin-bottom: 4px;
}

.problem-title:hover {
    color: #409EFF;
}

.problem-id {
    font-size: 0.8rem;
    color: #909399;
}

.language-tag {
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
}

.status-tag {
    font-weight: 500;
    min-width: 60px;
}

.time-used,
.memory-used {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9rem;
    color: #303133;
    font-weight: 500;
}

.no-data {
    color: #c0c4cc;
    font-style: italic;
}

/* 空状态 */
.empty-state {
    text-align: center;
    padding: 80px 20px;
    color: #909399;
}

.empty-state i {
    font-size: 4rem;
    margin-bottom: 16px;
    color: #d3d4d6;
}

.empty-state h3 {
    margin: 0 0 8px 0;
    color: #606266;
    font-size: 1.2rem;
}

.empty-state p {
    margin: 0 0 24px 0;
    color: #909399;
}

/* 分页 */
.pagination-wrapper {
    margin-top: 24px;
    display: flex;
    justify-content: center;
}

.submission-pagination>>>.el-pagination {
    display: flex;
    align-items: center;
    gap: 8px;
}

.submission-pagination>>>.el-pagination .el-pagination__total {
    color: #606266;
    font-weight: 500;
}

.submission-pagination>>>.el-pagination .btn-next,
.submission-pagination>>>.el-pagination .btn-prev {
    border-radius: 6px;
    border: 1px solid #e4e7ed;
    background-color: white;
}

.submission-pagination>>>.el-pagination .el-pager li {
    border-radius: 6px;
    border: 1px solid #e4e7ed;
    margin: 0 2px;
}

.submission-pagination>>>.el-pagination .el-pager li.active {
    background-color: #409EFF;
    border-color: #409EFF;
    color: white;
}

/* 对话框样式 */
.submission-dialog>>>.el-dialog {
    border-radius: 12px;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
}

.submission-dialog>>>.el-dialog__header {
    background-color: #f8f9fa;
    border-radius: 12px 12px 0 0;
    padding: 20px 24px;
}

.submission-dialog>>>.el-dialog__title {
    font-weight: 600;
    color: #303133;
}

.submission-dialog>>>.el-dialog__body {
    padding: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .submission-list {
        padding: 12px;
    }

    .page-title {
        font-size: 1.8rem;
    }

    .filter-form .el-col {
        margin-bottom: 12px;
    }

    .table-header {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
    }

    .submissions-table>>>.el-table .cell {
        padding: 8px;
    }

    .user-column {
        flex-direction: row;
        justify-content: center;
    }

    .time-column .time-main {
        font-size: 0.8rem;
    }

    .time-column .time-relative {
        display: none;
    }

    .problem-id {
        display: none;
    }
}

@media (max-width: 480px) {
    .page-title {
        font-size: 1.5rem;
        flex-direction: column;
        gap: 8px;
    }

    .search-btn {
        margin-top: 12px;
    }

    .submissions-table>>>.el-table .cell {
        padding: 6px 4px;
        font-size: 0.85rem;
    }

    .user-avatar {
        display: none;
    }

    .pagination-wrapper {
        margin-top: 16px;
    }

    .submission-pagination>>>.el-pagination {
        flex-wrap: wrap;
        justify-content: center;
    }
}

/* 动画效果 */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.filter-card,
.table-card {
    animation: fadeInUp 0.6s ease forwards;
}

.table-card {
    animation-delay: 0.1s;
}

/* 加载动画优化 */
.submissions-table>>>.el-loading-mask {
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.9);
}

.submissions-table>>>.el-loading-spinner {
    margin-top: -40px;
}
</style>
