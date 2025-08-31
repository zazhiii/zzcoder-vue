<template>
  <div class="home-container">
    <!-- 欢迎卡片 -->
    <el-card class="welcome-card" shadow="never">
      <div class="welcome-header">
        <h1 class="welcome-title">欢迎来到 <span class="brand">zzcoder</span></h1>
        <p class="welcome-subtitle">这里是一个供编程爱好者学习、练习和竞赛的平台</p>
      </div>
      <div class="welcome-content">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="8" :md="8">
            <div class="feature-card" @click="navigateTo('/problem')">
              <div class="feature-icon problem-icon">
                <i class="el-icon-collection"></i>
              </div>
              <h3>题库</h3>
              <p>海量编程题目等你来挑战</p>
              <div class="feature-overlay"></div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8">
            <div class="feature-card" @click="navigateTo('/problem-set')">
              <div class="feature-icon problemset-icon">
                <i class="el-icon-notebook-2"></i>
              </div>
              <h3>题单</h3>
              <p>精心编排的题目集合助你进步</p>
              <div class="feature-overlay"></div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8">
            <div class="feature-card" @click="navigateTo('/contest')">
              <div class="feature-icon contest-icon">
                <i class="el-icon-trophy"></i>
              </div>
              <h3>竞赛</h3>
              <p>参加比赛提升实战能力</p>
              <div class="feature-overlay"></div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- 用户信息和数据展示区域 -->
    <el-row :gutter="20" class="main-content">
      <el-col :xs="24" :sm="24" :md="isLogin ? 8 : 24">
        <!-- 已登录用户信息卡片 -->
        <el-card class="user-card" v-if="userInfo.username" v-loading="userStatLoading">
          <div class="user-info">
            <div class="user-profile">
              <div class="user-header">
                <el-avatar :src="userInfo.avatarUrl" :size="64" class="user-avatar">
                  <i class="el-icon-user-solid"></i>
                </el-avatar>
                <div class="user-details">
                  <h2 class="username">{{ userInfo.username }}</h2>
                  <p class="user-bio">编程爱好者</p>
                </div>
              </div>
              <div class="user-stats">
                <div class="stat-item">
                  <span class="stat-value">{{ userSubmissionStat.acProblem }}</span>
                  <span class="stat-label">已解决题目</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <span class="stat-value">{{ userSubmissionStat.acSubmit }}</span>
                  <span class="stat-label">通过提交数</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <span class="stat-value">{{ userSubmissionStat.totalSubmit }}</span>
                  <span class="stat-label">总提交次数</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <span class="stat-value">{{ calculateAcceptanceRate() }}%</span>
                  <span class="stat-label">通过率</span>
                </div>
              </div>
              <div class="quick-actions">
                <el-button size="small" @click="navigateTo('/user')" class="action-btn">
                  <i class="el-icon-user"></i> 个人主页
                </el-button>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 未登录提示卡片 -->
        <el-card v-else class="login-card">
          <div class="login-prompt">
            <div class="login-icon">
              <i class="el-icon-user"></i>
            </div>
            <h3>登录以开始你的编程之旅</h3>
            <p class="login-description">加入我们，解锁更多功能和个性化体验</p>
            <div class="login-actions">
              <el-button type="primary" @click="navigateTo('/auth')" class="login-btn">
                立即登录
              </el-button>
              <p class="register-hint">
                还没有账号?
                <el-link type="primary" @click="navigateTo('/auth')" :underline="false">
                  立即注册
                </el-link>
              </p>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="16" v-if="isLogin">
        <!-- 最近提交记录 -->
        <el-card class="recent-submissions" v-loading="submissionsLoading">
          <div slot="header" class="card-header">
            <span class="header-title">
              <i class="el-icon-time"></i>
              最近提交
            </span>
            <el-button size="mini" type="text" @click="navigateTo('/submissions')" class="more-btn">
              查看更多 <i class="el-icon-arrow-right"></i>
            </el-button>
          </div>

          <div v-if="recentSubmissions.length === 0 && !submissionsLoading" class="empty-state">
            <i class="el-icon-document-remove"></i>
            <p>暂无提交记录</p>
            <el-button size="small" @click="navigateTo('/problem')">
              去刷题
            </el-button>
          </div>

          <el-table v-else :data="recentSubmissions" style="width: 100%" :show-header="recentSubmissions.length > 0">
            <el-table-column prop="title" label="题目" min-width="200">
              <template #default="scope">
                <el-link @click="navigateTo(`/problem/${scope.row.problemId}`)" :underline="false" class="problem-link">
                  {{ scope.row.title || scope.row.problemTitle || '未知题目' }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="submitTime" label="提交时间" width="160">
              <template #default="scope">
                {{ formatTime(scope.row.submitTime) }}
              </template>
            </el-table-column>
            <el-table-column prop="language" label="语言" width="100">
              <template #default="scope">
                <el-tag size="mini" effect="plain">{{ scope.row.language }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="120">
              <template #default="scope">
                <el-tag :type="getResultType(scope.row.status)" size="mini" effect="dark">
                  {{ getResultText(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { mapState } from "vuex";
import { getSubmitStat } from '@/api/user';
import { pageSubmission } from "@/api/judge";

export default {
  name: 'HomePage',
  created() {
    this.initData();
  },
  data() {
    return {
      userSubmissionStat: {
        totalSubmit: 0,
        acProblem: 0,
        acSubmit: 0
      },
      recentSubmissions: [],
      userStatLoading: false,
      submissionsLoading: false,
      refreshTimer: null
    }
  },
  computed: {
    ...mapState('user', ['userInfo', 'isLogin']),
  },
  methods: {
    async initData() {
      if (this.isLogin) {
        await Promise.all([
          this.fetchUserSubmissionStat(),
          this.fetchRecentSubmissions()
        ]);
        this.startAutoRefresh();
      }
    },

    async fetchUserSubmissionStat() {
      if (!this.isLogin) return;

      this.userStatLoading = true;
      try {
        this.userSubmissionStat = await getSubmitStat();
      } catch (error) {
        console.error('获取用户统计信息失败:', error);
        this.$message.error('获取用户统计信息失败');
      } finally {
        this.userStatLoading = false;
      }
    },

    async fetchRecentSubmissions() {
      if (!this.isLogin) return;

      this.submissionsLoading = true;
      try {
        const data = await pageSubmission({
          page: 1,
          pageSize: 5,
          userId: this.userInfo.id
        });
        this.recentSubmissions = data.records || [];
      } catch (error) {
        console.error('获取最近提交记录失败:', error);
        this.$message.error('获取提交记录失败');
      } finally {
        this.submissionsLoading = false;
      }
    },

    startAutoRefresh() {
      // 每5分钟自动刷新数据
      this.refreshTimer = setInterval(() => {
        if (this.isLogin) {
          this.fetchUserSubmissionStat();
          this.fetchRecentSubmissions();
        }
      }, 5 * 60 * 1000);
    },

    navigateTo(path) {
      this.$router.push(path);
    },

    calculateAcceptanceRate() {
      if (this.userSubmissionStat.totalSubmit === 0) return 0;
      return Math.round((this.userSubmissionStat.acSubmit / this.userSubmissionStat.totalSubmit) * 100);
    },

    formatTime(timeString) {
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

    getResultType(result) {
      const statusMap = {
        'AC': 'success',
        'WA': 'danger',
        'TLE': 'warning',
        'MLE': 'warning',
        'RE': 'danger',
        'CE': 'info',
        'PE': 'warning',
        'JUDGING': 'info'
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
        'PE': '格式错误',
        'JUDGING': '评判中'
      }
      return statusTextMap[result] || '未知'
    }
  },

  beforeDestroy() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  },

  watch: {
    isLogin(newVal) {
      if (newVal) {
        this.initData();
      } else {
        if (this.refreshTimer) {
          clearInterval(this.refreshTimer);
        }
        this.recentSubmissions = [];
        this.userSubmissionStat = {
          totalSubmit: 0,
          acProblem: 0,
          acSubmit: 0
        };
      }
    }
  }
}
</script>

<style scoped>
.home-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 60px);
}

/* 欢迎区域样式 */
.welcome-card {
  margin-bottom: 24px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  overflow: hidden;
}

.welcome-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 20px 0;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.brand {
  background: linear-gradient(45deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

.welcome-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
  line-height: 1.6;
}

.welcome-content {
  padding: 0 20px 40px;
}

/* 功能卡片样式 */
.feature-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 32px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #303133;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.feature-card:hover::before {
  left: 100%;
}

.feature-icon {
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.feature-icon i {
  font-size: 3rem;
  transition: all 0.3s ease;
}

.problem-icon i {
  color: #409EFF;
}

.problemset-icon i {
  color: #67C23A;
}

.contest-icon i {
  color: #E6A23C;
}

.feature-card:hover .feature-icon i {
  transform: scale(1.1);
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 12px 0 8px;
  color: #303133;
}

.feature-card p {
  color: #606266;
  margin: 0;
  line-height: 1.5;
}

/* 主要内容区域 */
.main-content {
  margin-top: 24px;
}

/* 用户卡片样式 */
.user-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.user-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.user-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f2f5;
}

.user-avatar {
  margin-right: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-details {
  flex: 1;
}

.username {
  margin: 0 0 4px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #303133;
}

.user-bio {
  margin: 0;
  color: #909399;
  font-size: 0.9rem;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 24px 0;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  border-radius: 12px;
  flex-wrap: wrap;
  gap: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 80px;
}

.stat-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: #409EFF;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.8rem;
  color: #606266;
  text-align: center;
  line-height: 1.2;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #e4e7ed;
  margin: 0 8px;
}

.quick-actions {
  text-align: center;
  margin-top: 20px;
}

.action-btn {
  border-radius: 20px;
  padding: 8px 24px;
  font-weight: 500;
}

/* 登录卡片样式 */
.login-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-prompt {
  text-align: center;
  padding: 40px 20px;
}

.login-icon {
  margin-bottom: 24px;
}

.login-icon i {
  font-size: 4rem;
  color: #d3d4d6;
  transition: all 0.3s ease;
}

.login-card:hover .login-icon i {
  color: #409EFF;
  transform: scale(1.1);
}

.login-prompt h3 {
  margin-bottom: 12px;
  color: #303133;
  font-weight: 600;
}

.login-description {
  color: #909399;
  margin-bottom: 24px;
  line-height: 1.6;
}

.login-actions {
  margin-top: 24px;
}

.login-btn {
  border-radius: 24px;
  padding: 12px 32px;
  font-weight: 500;
  font-size: 1rem;
}

.register-hint {
  margin-top: 16px;
  color: #909399;
  font-size: 0.9rem;
}

/* 提交记录卡片样式 */
.recent-submissions {
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.more-btn {
  color: #409EFF;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
}

.more-btn:hover {
  transform: translateX(4px);
}

.problem-link {
  color: #303133;
  font-weight: 500;
  transition: color 0.3s ease;
}

.problem-link:hover {
  color: #409EFF;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 16px;
  color: #d3d4d6;
}

.empty-state p {
  margin-bottom: 20px;
  font-size: 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .home-container {
    padding: 16px;
  }

  .welcome-title {
    font-size: 1.8rem;
  }

  .welcome-subtitle {
    font-size: 1rem;
  }

  .feature-card {
    height: 160px;
    padding: 24px 16px;
    margin-bottom: 16px;
  }

  .feature-icon i {
    font-size: 2.5rem;
  }

  .user-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .user-stats {
    flex-direction: column;
    gap: 12px;
  }

  .stat-divider {
    width: 80%;
    height: 1px;
    margin: 6px 0;
  }

  .stat-item {
    flex-direction: row;
    gap: 12px;
    justify-content: space-between;
    width: 100%;
    padding: 0 10px;
  }

  .stat-value {
    font-size: 1.4rem;
  }

  .stat-label {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .welcome-content .el-col {
    margin-bottom: 12px;
  }

  .feature-card {
    height: 140px;
    padding: 20px 12px;
  }

  .welcome-title {
    font-size: 1.5rem;
  }

  .feature-icon i {
    font-size: 2rem;
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

.welcome-card,
.user-card,
.login-card,
.recent-submissions {
  animation: fadeInUp 0.6s ease forwards;
}

.user-card {
  animation-delay: 0.1s;
}

.recent-submissions {
  animation-delay: 0.2s;
}

/* Element UI 表格样式覆盖 */
.recent-submissions>>>.el-table {
  border-radius: 8px;
  overflow: hidden;
}

.recent-submissions>>>.el-table th {
  background-color: #f8f9fa;
  color: #606266;
  font-weight: 600;
}

.recent-submissions>>>.el-table tr:hover>td {
  background-color: #f8f9ff;
}

/* 加载状态优化 */
.recent-submissions>>>.el-loading-mask {
  border-radius: 12px;
}

.user-card>>>.el-loading-mask {
  border-radius: 12px;
}
</style>