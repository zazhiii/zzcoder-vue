<template>
    <div class="profile-container">
        <!-- 用户基本信息卡片 -->
        <el-card class="user-card" shadow="always">
            <div class="user-header">
                <div class="avatar-section">
                    <el-avatar :size="120" :src="userInfo.avatarUrl" class="user-avatar">
                        <i class="el-icon-user-solid"></i>
                    </el-avatar>
                    <div class="avatar-overlay">
                        <i class="el-icon-camera"></i>
                    </div>
                </div>
                <div class="user-details">
                    <h1 class="username">{{ userInfo.username }}</h1>
                    <p class="user-email">{{ userInfo.email || '未设置邮箱' }}</p>
                    <div class="user-tags">
                        <el-tag type="primary" effect="light">编程爱好者</el-tag>
                        <el-tag type="success" effect="light" v-if="userSubmissionStat.acProblem > 0">
                            活跃用户
                        </el-tag>
                    </div>
                    <div class="join-date">
                        <i class="el-icon-calendar"></i>
                        <span>加入时间：{{ formatDate(userInfo.createTime) }}</span>
                    </div>
                </div>
            </div>
        </el-card>

        <!-- 统计数据卡片 -->
        <el-card class="stats-card" shadow="always" v-loading="statsLoading">
            <div slot="header" class="card-header">
                <i class="el-icon-data-analysis"></i>
                <span>编程统计</span>
            </div>

            <el-row :gutter="20" class="stats-grid">
                <el-col :xs="12" :sm="6" :md="6">
                    <div class="stat-item solved">
                        <div class="stat-icon">
                            <i class="el-icon-check"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">{{ userSubmissionStat.acProblem }}</div>
                            <div class="stat-label">已解决题目</div>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="6" :md="6">
                    <div class="stat-item submitted">
                        <div class="stat-icon">
                            <i class="el-icon-upload"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">{{ userSubmissionStat.totalSubmit }}</div>
                            <div class="stat-label">总提交数</div>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="6" :md="6">
                    <div class="stat-item accepted">
                        <div class="stat-icon">
                            <i class="el-icon-success"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">{{ userSubmissionStat.acSubmit }}</div>
                            <div class="stat-label">通过提交数</div>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="6" :md="6">
                    <div class="stat-item rate">
                        <div class="stat-icon">
                            <i class="el-icon-pie-chart"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">{{ acceptanceRate }}%</div>
                            <div class="stat-label">通过率</div>
                        </div>
                    </div>
                </el-col>
            </el-row>

            <!-- 进度条展示 -->
            <div class="progress-section">
                <h3>解题进度</h3>
                <div class="progress-item">
                    <div class="progress-header">
                        <span>总体进度</span>
                        <span class="progress-text">{{ userSubmissionStat.acProblem }} 题</span>
                    </div>
                    <el-progress :percentage="Math.min(userSubmissionStat.acProblem * 2, 100)" :color="progressColors"
                        :stroke-width="8" class="custom-progress"></el-progress>
                </div>

                <div class="progress-item">
                    <div class="progress-header">
                        <span>通过率</span>
                        <span class="progress-text">{{ acceptanceRate }}%</span>
                    </div>
                    <el-progress :percentage="acceptanceRate" :color="getRateColor(acceptanceRate)" :stroke-width="8"
                        class="custom-progress"></el-progress>
                </div>
            </div>
        </el-card>

        <!-- 快速操作卡片 -->
        <el-card class="actions-card" shadow="always">
            <div slot="header" class="card-header">
                <i class="el-icon-s-tools"></i>
                <span>快速操作</span>
            </div>

            <el-row :gutter="16">
                <el-col :xs="12" :sm="8" :md="6">
                    <div class="action-item" @click="navigateTo('/problem')">
                        <div class="action-icon problem">
                            <i class="el-icon-collection"></i>
                        </div>
                        <div class="action-text">
                            <h4>去刷题</h4>
                            <p>挑战更多题目</p>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="8" :md="6">
                    <div class="action-item" @click="navigateTo('/submissions')">
                        <div class="action-icon submissions">
                            <i class="el-icon-document"></i>
                        </div>
                        <div class="action-text">
                            <h4>提交记录</h4>
                            <p>查看历史提交</p>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="8" :md="6">
                    <div class="action-item" @click="navigateTo('/contest')">
                        <div class="action-icon contest">
                            <i class="el-icon-trophy"></i>
                        </div>
                        <div class="action-text">
                            <h4>参加竞赛</h4>
                            <p>提升编程技能</p>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="8" :md="6">
                    <div class="action-item" @click="navigateTo('/user/settings')">
                        <div class="action-icon settings">
                            <i class="el-icon-setting"></i>
                        </div>
                        <div class="action-text">
                            <h4>账户设置</h4>
                            <p>修改个人信息</p>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { getSubmitStat } from '@/api/user';

export default {
    name: 'UserProfileComponent',
    data() {
        return {
            userSubmissionStat: {
                totalSubmit: 0,
                acProblem: 0,
                acSubmit: 0
            },
            statsLoading: false,
            progressColors: [
                { color: '#f56c6c', percentage: 20 },
                { color: '#e6a23c', percentage: 40 },
                { color: '#5cb87a', percentage: 60 },
                { color: '#1989fa', percentage: 80 },
                { color: '#6f7ad3', percentage: 100 }
            ]
        }
    },
    computed: {
        ...mapState('user', ['userInfo']),
        acceptanceRate() {
            if (this.userSubmissionStat.totalSubmit === 0) return 0;
            return Math.round((this.userSubmissionStat.acSubmit / this.userSubmissionStat.totalSubmit) * 100);
        }
    },
    created() {
        this.fetchUserStats();
    },
    methods: {
        async fetchUserStats() {
            this.statsLoading = true;
            try {
                this.userSubmissionStat = await getSubmitStat();
            } catch (error) {
                console.error('获取用户统计失败:', error);
                this.$message.error('获取统计数据失败');
            } finally {
                this.statsLoading = false;
            }
        },

        formatDate(dateString) {
            if (!dateString) return '未知';
            const date = new Date(dateString);
            return date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },

        getRateColor(rate) {
            if (rate >= 80) return '#67C23A';
            if (rate >= 60) return '#E6A23C';
            if (rate >= 40) return '#F56C6C';
            return '#909399';
        },

        navigateTo(path) {
            this.$router.push(path);
        }
    }
}
</script>

<style scoped>
.profile-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
    min-height: calc(100vh - 120px);
}

/* 用户信息卡片 */
.user-card {
    margin-bottom: 24px;
    border-radius: 16px;
    border: none;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    overflow: hidden;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.user-header {
    display: flex;
    align-items: center;
    padding: 40px;
    gap: 30px;
}

.avatar-section {
    position: relative;
    flex-shrink: 0;
}

.user-avatar {
    border: 4px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
}

.avatar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    cursor: pointer;
}

.avatar-section:hover .avatar-overlay {
    opacity: 1;
}

.avatar-overlay i {
    font-size: 24px;
    color: white;
}

.user-details {
    flex: 1;
}

.username {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 8px 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-email {
    font-size: 1.1rem;
    margin: 0 0 16px 0;
    opacity: 0.9;
}

.user-tags {
    margin-bottom: 16px;
}

.user-tags .el-tag {
    margin-right: 8px;
    margin-bottom: 8px;
    border: none;
    font-weight: 500;
}

.join-date {
    display: flex;
    align-items: center;
    gap: 8px;
    opacity: 0.8;
    font-size: 0.95rem;
}

/* 统计卡片 */
.stats-card {
    margin-bottom: 24px;
    border-radius: 16px;
    border: none;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: #303133;
    font-size: 1.1rem;
}

.stats-grid {
    margin-bottom: 32px;
}

.stat-item {
    display: flex;
    align-items: center;
    padding: 20px;
    background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
    border-radius: 12px;
    border: 1px solid #e4e7ed;
    transition: all 0.3s ease;
    cursor: pointer;
    margin-bottom: 16px;
}

.stat-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    font-size: 1.5rem;
}

.stat-item.solved .stat-icon {
    background: linear-gradient(135deg, #67C23A, #85ce61);
    color: white;
}

.stat-item.submitted .stat-icon {
    background: linear-gradient(135deg, #409EFF, #66b1ff);
    color: white;
}

.stat-item.accepted .stat-icon {
    background: linear-gradient(135deg, #E6A23C, #ebb563);
    color: white;
}

.stat-item.rate .stat-icon {
    background: linear-gradient(135deg, #F56C6C, #f78989);
    color: white;
}

.stat-content {
    flex: 1;
}

.stat-number {
    font-size: 1.8rem;
    font-weight: 700;
    color: #303133;
    margin-bottom: 4px;
}

.stat-label {
    font-size: 0.9rem;
    color: #606266;
}

/* 进度条部分 */
.progress-section {
    background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
    padding: 24px;
    border-radius: 12px;
    border: 1px solid #e4e7ed;
}

.progress-section h3 {
    margin: 0 0 20px 0;
    color: #303133;
    font-size: 1.2rem;
    font-weight: 600;
}

.progress-item {
    margin-bottom: 20px;
}

.progress-item:last-child {
    margin-bottom: 0;
}

.progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.progress-text {
    font-weight: 600;
    color: #409EFF;
}

.custom-progress>>>.el-progress-bar__outer {
    border-radius: 8px;
    background-color: #f0f2f5;
}

.custom-progress>>>.el-progress-bar__inner {
    border-radius: 8px;
    transition: all 0.8s ease;
}

/* 快速操作卡片 */
.actions-card {
    border-radius: 16px;
    border: none;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.action-item {
    display: flex;
    align-items: center;
    padding: 20px;
    background: white;
    border-radius: 12px;
    border: 1px solid #e4e7ed;
    transition: all 0.3s ease;
    cursor: pointer;
    margin-bottom: 16px;
}

.action-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-color: #409EFF;
}

.action-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    font-size: 1.5rem;
    color: white;
}

.action-icon.problem {
    background: linear-gradient(135deg, #409EFF, #66b1ff);
}

.action-icon.submissions {
    background: linear-gradient(135deg, #67C23A, #85ce61);
}

.action-icon.contest {
    background: linear-gradient(135deg, #E6A23C, #ebb563);
}

.action-icon.settings {
    background: linear-gradient(135deg, #909399, #a6a9ad);
}

.action-text h4 {
    margin: 0 0 4px 0;
    color: #303133;
    font-size: 1rem;
    font-weight: 600;
}

.action-text p {
    margin: 0;
    color: #606266;
    font-size: 0.85rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .profile-container {
        padding: 12px;
    }

    .user-header {
        flex-direction: column;
        text-align: center;
        padding: 30px 20px;
        gap: 20px;
    }

    .username {
        font-size: 2rem;
    }

    .stats-grid .el-col {
        margin-bottom: 12px;
    }

    .stat-item {
        padding: 16px;
    }

    .stat-number {
        font-size: 1.5rem;
    }

    .action-item {
        padding: 16px;
    }

    .action-icon {
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
        margin-right: 12px;
    }
}

@media (max-width: 480px) {
    .user-header {
        padding: 20px 16px;
    }

    .username {
        font-size: 1.8rem;
    }

    .stat-item {
        flex-direction: column;
        text-align: center;
        padding: 16px 12px;
    }

    .stat-icon {
        margin-right: 0;
        margin-bottom: 12px;
    }

    .action-item {
        flex-direction: column;
        text-align: center;
        padding: 16px 12px;
    }

    .action-icon {
        margin-right: 0;
        margin-bottom: 12px;
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

.user-card,
.stats-card,
.actions-card {
    animation: fadeInUp 0.6s ease forwards;
}

.stats-card {
    animation-delay: 0.1s;
}

.actions-card {
    animation-delay: 0.2s;
}
</style>
