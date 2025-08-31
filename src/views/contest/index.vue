<template>
  <div class="contest-container">
    <!-- 我的比赛区域 -->
    <el-card class="contest-card" shadow="hover">
      <div slot="header" class="card-header">
        <div class="header-left">
          <h2 class="page-title">
            <i class="el-icon-trophy-1"></i>
            本站比赛
          </h2>
          <el-tag v-if="total > 0" type="info" size="small">{{ total }} 场比赛</el-tag>
        </div>
        <div class="header-actions">
          <el-button v-if="userInfo.permissions && userInfo.permissions.includes('contest:create')" type="primary"
            icon="el-icon-plus" @click="jump('/contest/create')">
            创建比赛
          </el-button>
        </div>
      </div>

      <!-- 筛选和搜索 -->
      <div class="filter-section">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="pageQueryDTO.keyword" placeholder="搜索比赛名称" prefix-icon="el-icon-search" clearable
              @keyup.enter.native="handleSearch" @clear="handleSearch">
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-select v-model="pageQueryDTO.contestStatus" placeholder="比赛状态" clearable @change="handleSearch">
              <el-option label="全部状态" value=""></el-option>
              <el-option label="未开始" value="0"></el-option>
              <el-option label="进行中" value="1"></el-option>
              <el-option label="已结束" value="2"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="pageQueryDTO.type" placeholder="比赛类型" clearable @change="handleSearch">
              <el-option label="全部类型" value=""></el-option>
              <el-option label="个人赛" value="individual"></el-option>
              <el-option label="团队赛" value="team"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 比赛表格 -->
      <el-table :data="contests" v-loading="contestLoading" class="contest-table" stripe size="small"
        @row-click="handleRowClick">
        <el-table-column prop="id" label="ID" width="60" align="center"></el-table-column>
        <el-table-column prop="title" label="比赛名称" min-width="200">
          <template slot-scope="scope">
            <div class="contest-title">
              <el-link type="primary" :underline="false" @click.stop="jump(`/contest/${scope.row.id}`)">
                {{ scope.row.title }}
              </el-link>
              <el-tag v-if="scope.row.isOfficial" type="warning" size="mini" class="official-tag">
                官方
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" width="150">
          <template slot-scope="scope">
            <div class="time-info">
              <i class="el-icon-time"></i>
              {{ formatTime(scope.row.startTime) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="持续时间" width="100" align="center">
          <template slot-scope="scope">
            <el-tag type="info" size="mini">{{ formatDuration(scope.row.duration) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createUserName" label="创建者" width="100"></el-table-column>
        <el-table-column prop="registerCount" label="报名人数" width="80" align="center">
          <template slot-scope="scope">
            <el-badge :value="scope.row.registerCount" class="register-badge">
              <i class="el-icon-user"></i>
            </el-badge>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.status)" size="mini"
              :effect="scope.row.status === 1 ? 'plain' : 'light'">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="倒计时" width="120" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 0" class="countdown">
              <i class="el-icon-timer"></i>
              {{ getContestCountdown(scope.row.startTime) }}
            </div>
            <div v-else-if="scope.row.status === 1" class="countdown running">
              <i class="el-icon-video-play"></i>
              进行中
            </div>
            <span v-else class="finished">已结束</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="pageQueryDTO.pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="pageQueryDTO.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-card>

    <!-- 即将到来的比赛 -->
    <el-card class="upcoming-card" shadow="hover">
      <div slot="header" class="card-header">
        <div class="header-left">
          <h2 class="page-title">
            <i class="el-icon-alarm-clock"></i>
            即将到来的比赛
          </h2>
          <el-tag v-if="upcomingContests.length > 0" type="success" size="small">
            {{ upcomingContests.length }} 场比赛
          </el-tag>
        </div>
        <div class="header-actions">
          <el-button type="text" icon="el-icon-refresh" @click="fetchUpcomingContests" :loading="upcomingTableLoading">
            刷新
          </el-button>
        </div>
      </div>

      <!-- 平台选择 -->
      <div class="platform-section">
        <div class="platform-label">选择平台：</div>
        <el-checkbox-group v-model="chosenPlatforms" @change="fetchUpcomingContests" class="platform-checkboxes">
          <el-checkbox-button label="leetcode">LeetCode</el-checkbox-button>
          <el-checkbox-button label="codeforces">Codeforces</el-checkbox-button>
          <el-checkbox-button label="nowcoder">牛客</el-checkbox-button>
          <el-checkbox-button label="luogu">洛谷</el-checkbox-button>
          <el-checkbox-button label="atcoder">AtCoder</el-checkbox-button>
        </el-checkbox-group>
      </div>

      <!-- 即将到来的比赛表格 -->
      <el-table :data="upcomingContests" v-loading="upcomingTableLoading" class="upcoming-table" size="small" stripe>
        <el-table-column prop="event" label="竞赛名称" min-width="250">
          <template #default="scope">
            <el-link :href="scope.row.href" target="_blank" type="primary" class="contest-link">
              {{ scope.row.event }}
              <i class="el-icon-top-right"></i>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="start" label="开始时间" width="140">
          <template #default="scope">
            <div class="time-info">
              <i class="el-icon-time"></i>
              {{ formatUpcomingTime(scope.row.start) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="持续时间" width="100" align="center">
          <template #default="scope">
            <el-tag type="info" size="mini">
              {{ formatUpcomingDuration(scope.row.duration) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="new Date(scope.row.start + 'Z') > new Date()" type="warning" size="mini">
              {{ getRemainingTime(scope.row.start) }}
            </el-tag>
            <el-tag v-else-if="new Date(scope.row.end + 'Z') < new Date()" type="info" size="mini">
              已结束
            </el-tag>
            <el-tag v-else type="success" size="mini">
              进行中
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="resource" label="来源" width="120" align="center">
          <template #default="scope">
            <el-link :href="`https://${scope.row.resource}`" target="_blank" type="success" class="platform-link">
              {{ getPlatformName(scope.row.resource) }}
            </el-link>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态 -->
      <div v-if="!upcomingTableLoading && upcomingContests.length === 0" class="empty-state">
        <i class="el-icon-info"></i>
        <p>暂无即将到来的比赛</p>
        <el-button type="text" @click="fetchUpcomingContests">重新加载</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getContestList, getUpcomingContestsFromClist } from '@/api/contest'
import { mapState } from "vuex";

export default {
  name: 'ContestList',
  data() {
    return {
      pageQueryDTO: {
        pageNum: 1,
        pageSize: 10,
        keyword: '',
        contestStatus: '',
        type: ''
      },
      total: 0,
      contests: [],
      contestLoading: false,
      // clist 相关
      upcomingContests: [],
      chosenPlatforms: ['leetcode', 'codeforces', 'nowcoder', 'luogu', 'atcoder'],
      upcomingTableLoading: false,
      // 定时器
      countdownTimer: null,
    }
  },
  computed: {
    ...mapState('user', ['userInfo']),
  },
  created() {
    this.fetchContests(this.pageQueryDTO)
    this.fetchUpcomingContests();
    this.startCountdownTimer();
  },
  beforeDestroy() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  },
  methods: {
    // 启动倒计时定时器
    startCountdownTimer() {
      this.countdownTimer = setInterval(() => {
        this.$forceUpdate(); // 强制更新倒计时显示
      }, 1000);
    },

    // 搜索处理
    handleSearch() {
      this.pageQueryDTO.pageNum = 1;
      this.fetchContests(this.pageQueryDTO);
    },

    // 分页大小改变
    handleSizeChange(val) {
      this.pageQueryDTO.pageSize = val;
      this.pageQueryDTO.pageNum = 1;
      this.fetchContests(this.pageQueryDTO);
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.pageQueryDTO.pageNum = val;
      this.fetchContests(this.pageQueryDTO);
    },

    // 行点击事件
    handleRowClick(row) {
      this.jump(`/contest/${row.id}`);
    },

    // 格式化时间
    formatTime(timeStr) {
      if (!timeStr) return '-';
      const date = new Date(timeStr);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    // 格式化持续时间
    formatDuration(duration) {
      if (!duration) return '-';

      // 本站比赛的 duration 通常是以分钟为单位
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;

      if (hours >= 24) {
        const days = Math.floor(hours / 24);
        const remainHours = hours % 24;
        if (remainHours > 0) {
          return `${days}天${remainHours}时`;
        }
        return `${days}天`;
      }

      if (hours > 0) {
        if (minutes > 0) {
          return `${hours}时${minutes}分`;
        }
        return `${hours}时`;
      }

      return `${minutes}分`;
    },

    // 格式化即将到来比赛的时间
    formatUpcomingTime(timeStr) {
      if (!timeStr) return '-';
      const date = new Date(timeStr + 'Z');
      return date.toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    // 格式化即将到来比赛的持续时间
    formatUpcomingDuration(duration) {
      if (!duration) return '-';

      // duration 通常是以秒为单位
      const totalMinutes = Math.floor(duration / 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      if (hours >= 24) {
        const days = Math.floor(hours / 24);
        const remainHours = hours % 24;
        if (remainHours > 0) {
          return `${days}天${remainHours}时`;
        }
        return `${days}天`;
      }

      if (hours > 0) {
        if (minutes > 0) {
          return `${hours}时${minutes}分`;
        }
        return `${hours}时`;
      }

      return `${totalMinutes}分`;
    },

    // 获取状态类型
    getStatusType(status) {
      const statusMap = {
        0: 'warning',  // 未开始
        1: 'success',  // 进行中
        2: 'info'      // 已结束
      };
      return statusMap[status] || 'info';
    },

    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        0: '未开始',
        1: '进行中',
        2: '已结束'
      };
      return statusMap[status] || '未知';
    },

    // 获取比赛倒计时
    getContestCountdown(startTime) {
      if (!startTime) return '-';
      const now = new Date();
      const start = new Date(startTime);
      const diff = start - now;

      if (diff <= 0) return '已开始';

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        if (hours > 0) {
          return `${days}天${hours}时`;
        }
        return `${days}天`;
      }
      if (hours > 0) {
        if (minutes > 0) {
          return `${hours}时${minutes}分`;
        }
        return `${hours}时`;
      }
      return `${minutes}分`;
    },

    // 获取平台名称
    getPlatformName(resource) {
      const platformMap = {
        'leetcode.com': 'LeetCode',
        'codeforces.com': 'Codeforces',
        'ac.nowcoder.com': '牛客',
        'www.luogu.com.cn': '洛谷',
        'atcoder.jp': 'AtCoder'
      };
      return platformMap[resource] || resource;
    },

    // 获取即将到来的比赛
    async fetchUpcomingContests() {
      if (this.chosenPlatforms.length === 0) {
        this.upcomingContests = [];
        return;
      }

      this.upcomingTableLoading = true;
      try {
        const regex = this.chosenPlatforms.join('|');
        this.upcomingContests = await getUpcomingContestsFromClist(regex);

        // 按开始时间排序
        this.upcomingContests.sort((a, b) => {
          return new Date(a.start + 'Z') - new Date(b.start + 'Z');
        });
      } catch (error) {
        console.error('获取即将到来的比赛失败', error);
        this.$message.error('获取即将到来的比赛失败');
      } finally {
        this.upcomingTableLoading = false;
      }
    },

    // 获取剩余时间
    getRemainingTime(startTime) {
      const now = new Date();
      const start = new Date(startTime + 'Z');
      const diff = start - now;

      if (diff <= 0) return '已开始';

      if (diff > 24 * 60 * 60 * 1000) {
        const day = Math.floor(diff / 1000 / 60 / 60 / 24);
        const hour = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (hour > 0) {
          return `${day}天${hour}时`;
        }
        return `${day}天`;
      }
      if (diff > 60 * 60 * 1000) {
        const hour = Math.floor(diff / 1000 / 60 / 60);
        const minute = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        if (minute > 0) {
          return `${hour}时${minute}分`;
        }
        return `${hour}时`;
      }
      if (diff > 60 * 1000) {
        const minute = Math.floor(diff / 1000 / 60);
        return `${minute}分`;
      }
      return `${Math.floor(diff / 1000)}秒`;
    },

    // 获取比赛列表
    async fetchContests(pageQueryDTO) {
      this.contestLoading = true;
      try {
        const data = await getContestList(pageQueryDTO);
        this.contests = data.records || [];
        this.total = data.total || 0;
      } catch (error) {
        console.error('获取比赛列表失败', error);
        this.$message.error('获取比赛列表失败');
      } finally {
        this.contestLoading = false;
      }
    },

    // 页面跳转
    jump(path) {
      this.$router.push(path);
    }
  }
}
</script>

<style scoped>
.contest-container {
  padding: 16px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.contest-card,
.upcoming-card {
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
}

.contest-card:last-child,
.upcoming-card:last-child {
  margin-bottom: 0;
}

/* 卡片头部样式 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-title i {
  color: #409EFF;
  font-size: 22px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

/* 筛选区域 */
.filter-section {
  margin-bottom: 16px;
  padding: 16px;
  background-color: #fafbfc;
  border-radius: 6px;
  border: 1px solid #ebeef5;
}

/* 平台选择区域 */
.platform-section {
  margin-bottom: 16px;
  padding: 12px 16px;
  background-color: #fafbfc;
  border-radius: 6px;
  border: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.platform-label {
  font-weight: 500;
  color: #606266;
  white-space: nowrap;
}

.platform-checkboxes {
  flex: 1;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

/* 表格样式 */
.contest-table,
.upcoming-table {
  margin-top: 0;
}

.contest-table .el-table__row {
  cursor: pointer;
  transition: all 0.3s;
}

.contest-table .el-table__row:hover {
  background-color: #f5f7fa;
}

/* 比赛标题样式 */
.contest-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.official-tag {
  transform: scale(0.85);
}

/* 时间信息样式 */
.time-info {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #606266;
}

.time-info i {
  color: #909399;
}

/* 报名徽章样式 */
.register-badge {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 倒计时样式 */
.countdown {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #E6A23C;
  font-weight: 500;
  font-size: 12px;
}

.countdown.running {
  color: #67C23A;
}

.countdown i {
  font-size: 14px;
}

.finished {
  color: #909399;
  font-size: 12px;
}

/* 链接样式 */
.contest-link {
  display: flex;
  align-items: center;
  gap: 4px;
}

.contest-link i {
  font-size: 12px;
  opacity: 0.7;
}

.platform-link {
  font-weight: 500;
}

/* 分页样式 */
.pagination-wrapper {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  padding: 16px 0;
  border-top: 1px solid #ebeef5;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #909399;
}

.empty-state i {
  font-size: 36px;
  color: #C0C4CC;
  margin-bottom: 12px;
  display: block;
}

.empty-state p {
  margin: 0 0 12px 0;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .contest-container {
    padding: 12px;
  }

  .platform-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .platform-checkboxes {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .contest-container {
    padding: 8px;
  }

  .card-header {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .header-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .page-title {
    font-size: 16px;
  }

  .filter-section {
    padding: 12px;
  }

  .filter-section .el-row {
    flex-direction: column;
    gap: 8px;
  }

  .filter-section .el-col {
    width: 100% !important;
  }

  .platform-checkboxes .el-checkbox-button {
    flex: 1;
    min-width: 0;
  }

  .platform-checkboxes .el-checkbox-button__inner {
    width: 100%;
    text-align: center;
    font-size: 11px;
    padding: 6px 2px;
  }

  /* 表格响应式 */
  .contest-table .el-table__header th,
  .contest-table .el-table__body td,
  .upcoming-table .el-table__header th,
  .upcoming-table .el-table__body td {
    padding: 6px 2px;
  }

  .time-info {
    flex-direction: column;
    gap: 2px;
    font-size: 11px;
  }

  .countdown {
    font-size: 9px;
  }

  .pagination-wrapper {
    margin-top: 12px;
    padding: 12px 0;
  }
}

/* 动画效果 */
.contest-card,
.upcoming-card {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.el-table__row {
  transition: all 0.3s ease;
}

.el-tag {
  border-radius: 12px;
  font-weight: 500;
}

.el-button {
  border-radius: 8px;
  font-weight: 500;
}

.el-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  border: none;
}

.el-card:hover {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, .12);
}
</style>
