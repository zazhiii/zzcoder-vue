<template>
  <div class="problem-set-detail">
    <z-header :back-url="'/problem-set'" :title="problemSetInfo.title || '题单详情'"></z-header>

    <div class="detail-container" v-loading="loading">
      <el-tabs v-model="activeTab" type="card" class="problem-set-tabs">
        <!-- 基本信息标签页 -->
        <el-tab-pane label="基本信息" name="info">
          <div class="problem-set-info">
            <div class="info-header">
              <h1 class="title">{{ problemSetInfo.title }}</h1>
              <div class="meta-info">
                <span class="creator">
                  <i class="el-icon-user"></i>
                  创建者：{{ problemSetInfo.createUserName }}
                </span>
                <span class="create-time">
                  <i class="el-icon-time"></i>
                  创建时间：{{ new Date(problemSetInfo.createTime).toLocaleDateString() }}
                </span>
                <span class="status" :class="problemSetInfo.status === 1 ? 'public' : 'private'">
                  <i :class="problemSetInfo.status === 1 ? 'el-icon-unlock' : 'el-icon-lock'"></i>
                  {{ problemSetInfo.status === 1 ? '公开' : '私有' }}
                </span>
              </div>
            </div>

            <div class="description-section" v-if="problemSetInfo.description">
              <h3>题单描述</h3>
              <div class="description-content">
                <markdown-renderer :content="problemSetInfo.description"></markdown-renderer>
              </div>
            </div>

            <div class="empty-description" v-else>
              <i class="el-icon-document"></i>
              <p>该题单暂无描述信息</p>
            </div>
          </div>
        </el-tab-pane>

        <!-- 题目列表标签页 -->
        <el-tab-pane name="problems">
          <span slot="label">
            <i class="el-icon-collection"></i>
            题目列表
          </span>

          <div class="problems-section">
            <div class="section-header">
              <h2>题目列表</h2>
              <div class="problem-stats">
                <span class="total-count">
                  共 {{ localProblems.length + externalProblems.length }} 道题目
                </span>
                <span class="local-count">
                  本站：{{ localProblems.length }} 道
                </span>
                <span class="external-count">
                  外站：{{ externalProblems.length }} 道
                </span>
              </div>
            </div>

            <!-- 本站题目 -->
            <div class="problem-group" v-if="localProblems.length > 0">
              <div class="group-header">
                <i class="el-icon-medal"></i>
                <h3>本站题目</h3>
              </div>
              <el-table
                :data="localProblems"
                style="width: 100%; margin-bottom: 20px;"
              >
                <el-table-column type="index" label="序号" width="60" align="center">
                  <template slot-scope="scope">
                    <div class="problem-index local-index">{{ scope.$index + 1 }}</div>
                  </template>
                </el-table-column>

                <el-table-column label="题目名称" min-width="200">
                  <template slot-scope="scope">
                    <div class="problem-title-cell">
                      <span class="problem-title" @click="viewProblem(scope.row.id)">
                        {{ scope.row.title }}
                      </span>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column label="难度" width="100" align="center">
                  <template slot-scope="scope">
                    <difficulty-tag :difficulty="scope.row.difficulty"></difficulty-tag>
                  </template>
                </el-table-column>

                <el-table-column label="提交数" width="100" align="center">
                  <template slot-scope="scope">
                    <span class="stat-number">{{ scope.row.submitCount || 0 }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="通过数" width="100" align="center">
                  <template slot-scope="scope">
                    <span class="stat-number success">{{ scope.row.acceptCount || 0 }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="通过率" width="100" align="center">
                  <template slot-scope="scope">
                    <span class="accept-rate">
                      {{ scope.row.acceptCount && scope.row.submitCount ?
                          Math.round((scope.row.acceptCount / scope.row.submitCount) * 100) : 0 }}%
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- 外站题目 -->
            <div class="problem-group" v-if="externalProblems.length > 0">
              <div class="group-header">
                <i class="el-icon-link"></i>
                <h3>外站题目</h3>
              </div>
              <el-table
                :data="externalProblems"
                style="width: 100%; margin-bottom: 20px;"
                @row-click="handleExternalProblemClick"
                class="problem-table external-table"
              >
                <el-table-column type="index" label="序号" width="60" align="center">
                  <template slot-scope="scope">
                    <div class="problem-index external-index">{{ localProblems.length + scope.$index + 1 }}</div>
                  </template>
                </el-table-column>

                <el-table-column label="题目名称" min-width="200">
                  <template slot-scope="scope">
                    <div class="problem-title-cell">
                      <span class="problem-title" @click="viewExternalProblem(scope.row.url)">
                        {{ scope.row.title }}
                      </span>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column label="平台" width="120" align="center">
                  <template slot-scope="scope">
                    <platform-tag
                      :platform="scope.row.platform"
                      size="small"
                      :custom-url="scope.row.url"
                    />
                  </template>
                </el-table-column>

                <el-table-column label="难度" width="100" align="center">
                  <template slot-scope="scope">
                    <difficulty-tag :difficulty="scope.row.difficulty"></difficulty-tag>
                  </template>
                </el-table-column>

                <el-table-column label="链接" width="120" align="center">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="small"
                      @click="viewExternalProblem(scope.row.url)"
                      class="link-btn"
                    >
                      <i class="el-icon-link"></i> 访问
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- 空状态 -->
            <div v-if="localProblems.length === 0 && externalProblems.length === 0" class="empty-problems">
              <i class="el-icon-document-remove"></i>
              <p>该题单暂无题目</p>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import ZHeader from '@/components/ZHeader.vue';
import MarkdownRenderer from '@/components/MarkdownRenderer.vue';
import DifficultyTag from '@/components/DifficultyTag.vue';
import PlatformTag from '@/components/PlatformTag.vue';
import { getProblemSetDetail } from '@/api/problemSet';

export default {
  name: 'ProblemSet',
  components: { ZHeader, MarkdownRenderer, DifficultyTag, PlatformTag },
  data() {
    return {
      loading: false,
      problemSetInfo: {},
      localProblems: [],
      externalProblems: [],
      activeTab: 'info' // 默认激活的标签页
    }
  },
  mounted() {
    this.fetchProblemSetDetail();
  },
  methods: {
    async fetchProblemSetDetail() {
        const data = await getProblemSetDetail(this.$route.params.problemSetId);
        this.problemSetInfo = {
          id: data.id,
          title: data.title,
          description: data.description,
          createUserName: data.createUserName,
          createTime: data.createTime,
          status: data.status
        }
        this.localProblems = data.internalProblems || [];
        console.log(this.localProblems)
        this.externalProblems = data.externalProblems || [];
    },
    getPlatformClass(platform) {
      const classMap = {
        'Codeforces': 'codeforces',
        'AtCoder': 'atcoder',
        'LeetCode': 'leetcode',
        'HDU': 'hdu',
        'POJ': 'poj'
      };
      return classMap[platform] || 'other';
    },

    viewProblem(problemId) {
      this.$router.push(`/problem/${problemId}`);
    },

    viewExternalProblem(url) {
      window.open(url, '_blank');
    },

    // 处理本站题目行点击
    handleLocalProblemClick(row) {
      this.viewProblem(row.id);
    },

    // 处理外站题目行点击
    handleExternalProblemClick(row) {
      this.viewExternalProblem(row.url);
    }
  }
}
</script>

<style scoped>
.problem-set-detail {
  min-height: 100vh;
}

.detail-container {
  padding: 0 20px 0;
  margin: 0 auto;
}

/* 标签页样式 */
.problem-set-tabs {
  margin-bottom: 20px;
}

.el-tabs__header {
  background: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
  padding: 0;
  margin: 0 0 20px 0;
}

.el-tab-pane {
  padding: 0;
}

/* ���单信息样式 */
.problem-set-info {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.info-header {
  margin-bottom: 24px;
}

.title {
  margin: 0 0 16px 0;
  font-size: 28px;
  font-weight: 600;
  color: #303133;
}

.meta-info {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  font-size: 14px;
  color: #606266;
}

.meta-info i {
  margin-right: 4px;
}

.status.public {
  color: #67c23a;
}

.status.private {
  color: #909399;
}

.description-section h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  border-left: 4px solid #409eff;
  padding-left: 10px;
}

.description-content {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 20px;
  border: 1px solid #ebeef5;
}

.empty-description {
  text-align: center;
  padding: 40px 20px;
  color: #909399;
}

.empty-description i {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
  color: #c0c4cc;
}

.empty-description p {
  margin: 0;
  font-size: 16px;
}

/* 题目列表样式 */
.problems-section {
  background: white;
  border-radius: 8px;
  padding: 0 24px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.problem-stats {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #606266;
}

.total-count {
  font-weight: 600;
  color: #303133;
}

.local-count {
  color: #409eff;
}

.external-count {
  color: #67c23a;
}

/* 题目分组样式 */
.problem-group {
  margin-bottom: 32px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #ebeef5;
}

.group-header i {
  font-size: 18px;
  color: #409eff;
}

.group-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

/* 表格样式 */
.problem-table :deep(.el-table__row) {
  cursor: pointer;
}

.problem-table :deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}

/* 表格内容样式 */
.problem-index {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.local-index {
  background: #ecf5ff;
  color: #409eff;
}

.external-index {
  background: #f0f9ff;
  color: #67c23a;
}

.problem-title-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.problem-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  cursor: pointer;
}

.problem-title:hover {
  color: #409eff;
}

.problem-id {
  font-size: 12px;
  color: #909399;
  background: #f5f7fa;
  padding: 2px 6px;
  border-radius: 3px;
  align-self: flex-start;
}

.problem-description {
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
}

.platform-tag {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.platform-tag.codeforces {
  background: #ff6b6b;
  color: white;
}

.platform-tag.atcoder {
  background: #3742fa;
  color: white;
}

.platform-tag.leetcode {
  background: #ffa502;
  color: white;
}

.platform-tag.other {
  background: #747d8c;
  color: white;
}

.stat-number {
  font-weight: 500;
  color: #606266;
}

.stat-number.success {
  color: #67c23a;
}

.accept-rate {
  font-weight: 500;
  color: #409eff;
}

.link-btn {
  color: #409eff;
}

.link-btn:hover {
  color: #66b1ff;
}

/* 空状态样式 */
.empty-problems {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}

.empty-problems i {
  font-size: 64px;
  margin-bottom: 16px;
  display: block;
  color: #c0c4cc;
}

.empty-problems p {
  margin: 0;
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .detail-container {
    padding: 12px;
  }

  .problem-set-info,
  .problems-section {
    padding: 16px;
  }

  .title {
    font-size: 24px;
  }

  .meta-info {
    flex-direction: column;
    gap: 8px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .problem-stats {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
