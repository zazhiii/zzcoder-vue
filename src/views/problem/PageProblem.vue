<template>
  <div class="problem-container">
    <!-- 搜索和筛选区域 -->
    <div class="search-section">
      <div class="search-row">
        <!-- 关键词搜索 -->
        <div class="search-input">
          <el-input placeholder="搜索题目标题或题号..." v-model="problemQueryDTO.keyword" size="small" clearable
            @keyup.enter.native="handleSearch">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>

        <!-- 难度选择 -->
        <DifficultyOptions v-model="problemQueryDTO.difficulty" size="small" clearable placeholder="选择难度">
        </DifficultyOptions>

        <!-- 标签选择 -->
        <el-button @click="openTagDrawer" size="small" :type="problemQueryDTO.tagId.length > 0 ? 'primary' : ''" plain>
          <i class="el-icon-price-tag"></i>
          标签 ({{ problemQueryDTO.tagId.length }})
        </el-button>

        <!-- 显示标签开关 -->
        <el-switch v-model="showTags" active-text="显示标签" inactive-text="隐藏标签" size="small">
        </el-switch>

        <!-- 搜索按钮 -->
        <el-button type="primary" icon="el-icon-search" @click="handleSearch" size="small" :loading="loading">
          搜索
        </el-button>

        <!-- 重置按钮 -->
        <el-button type="info" icon="el-icon-refresh-left" @click="resetFilters" size="small" plain>
          重置
        </el-button>

        <!-- 添加题目（如果有权限） -->
        <el-button v-if="userInfo.permissions.includes('problem:add')" size="small" type="success" icon="el-icon-plus"
          @click="jump(`/problem/add`)">
          添加题目
        </el-button>
      </div>

      <!-- 已选择的标签 -->
      <div class="selected-tags" v-if="problemQueryDTO.tagId.length > 0">
        <span class="tags-label">已选择标签:</span>
        <el-tag v-for="tagId in problemQueryDTO.tagId" :key="tagId" closable @close="removeTag(tagId)" size="small"
          class="selected-tag">
          {{ getTagName(tagId) }}
        </el-tag>
        <el-button type="text" size="mini" @click="clearAllTags" class="clear-all-btn">
          清空全部
        </el-button>
      </div>

      <!-- 标签抽屉 -->
      <el-drawer title="选择标签" :visible.sync="drawer" direction="rtl" size="360px" :modal="true"
        :modal-append-to-body="true" :append-to-body="true" class="tag-drawer">
        <div class="tag-drawer-content">
          <el-input placeholder="搜索标签..." v-model="tagSearchKeyword" size="small" clearable
            style="margin-bottom: 16px;">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-checkbox-group v-model="problemQueryDTO.tagId">
            <el-checkbox v-for="tag in filteredTags" :label="tag.id" :key="tag.id"
              style="display: block; margin-bottom: 8px;">
              {{ tag.name }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-drawer>
    </div>

    <!-- 题目列表和分页 -->
    <div class="table-section">
      <!-- 统计信息 -->
      <div class="stats-bar" v-if="!loading">
        <span class="stats-text">共找到 {{ problemQueryDTO.total }} 道题目</span>
        <div class="table-actions">
          <el-tooltip content="刷新列表" placement="top">
            <el-button type="text" icon="el-icon-refresh" @click="refreshProblems" :loading="loading" size="small">
            </el-button>
          </el-tooltip>
        </div>
      </div>

      <!-- 题目表格 -->
      <el-table :data="problems" style="width: 100%" v-loading="loading" element-loading-text="加载中..." size="small"
        stripe highlight-current-row @row-click="handleRowClick" class="problem-table">

        <el-table-column prop="problemNumber" label="题号" width="70" sortable>
          <template slot-scope="scope">
            <el-tag size="mini" type="info">{{ scope.row.problemNumber }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="title" label="标题" min-width="180">
          <template slot-scope="scope">
            <el-link type="primary" @click="jump(`/problem/${scope.row.id}`)" class="problem-title-link">
              {{ scope.row.title }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column prop="tags" label="标签" width="160" v-if="showTags">
          <template v-slot="scope">
            <div class="tags-container">
              <el-tag v-for="(tag, index) in scope.row.tags.slice(0, 2)" :key="index" size="mini" effect="plain"
                class="problem-tag">
                {{ tag }}
              </el-tag>
              <span v-if="scope.row.tags && scope.row.tags.length > 2" class="more-tags">
                +{{ scope.row.tags.length - 2 }}
              </span>
              <span v-if="scope.row.tags && scope.row.tags.length === 0" class="no-tags">
                无标签
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="difficulty" label="难度" width="80" sortable>
          <template v-slot="scope">
            <DifficultyTag :difficulty="scope.row.difficulty" size="mini" />
          </template>
        </el-table-column>

        <el-table-column prop="acceptance" label="通过率" width="90" sortable>
          <template v-slot="scope">
            <span class="acceptance-text">
              {{ formatPercentage(scope.row.acceptance || 0) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="80" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click.stop="jump(`/problem/${scope.row.id}`)" plain>
              查看
            </el-button>
          </template>
        </el-table-column>

        <!-- 空状态 -->
        <template slot="empty">
          <div class="empty-state">
            <i class="el-icon-document-remove"></i>
            <p>暂无符合条件的题目</p>
            <el-button type="primary" size="mini" @click="resetFilters">
              重置筛选条件
            </el-button>
          </div>
        </template>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination @current-change="handleCurrentChange" @size-change="sizeChange"
          :current-page="problemQueryDTO.page" :page-sizes="[10, 20, 50, 100]" :page-size="problemQueryDTO.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="problemQueryDTO.total" :disabled="loading" background
          small>
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllTags, getProblemList } from '@/api/problem';
import { mapState } from "vuex";
import DifficultyOptions from "@/components/DifficultySelect.vue"
import DifficultyTag from '../../components/DifficultyTag.vue';

export default {
  name: 'ProblemListView',
  components: {
    DifficultyOptions,
    DifficultyTag
  },
  computed: {
    ...mapState('user', ['isLogin', 'userInfo']),
    // 过滤标签
    filteredTags() {
      if (!this.tagSearchKeyword) {
        return this.tags;
      }
      return this.tags.filter(tag =>
        tag.name.toLowerCase().includes(this.tagSearchKeyword.toLowerCase())
      );
    }
  },
  data() {
    return {
      problemQueryDTO: {
        pageSize: 10,
        page: 1,
        keyword: '',
        tagId: [],
        difficulty: '',
        source: '',
        visible: true,
        total: 0
      },
      drawer: false,
      problems: [],
      tags: [],
      showTags: true,
      loading: false,
      tagSearchKeyword: '', // 标签搜索关键词
      searchTimer: null, // 搜索防抖定时器
    }
  },
  created() {
    this.fetchProblems();
    // 监听路由变化
    this.$watch('$route', () => {
      this.fetchProblems();
    });
  },

  watch: {
    // 监听关键词变化，实现防抖搜索
    'problemQueryDTO.keyword': {
      handler(newVal) {
        if (this.searchTimer) {
          clearTimeout(this.searchTimer);
        }
        this.searchTimer = setTimeout(() => {
          if (newVal !== this.lastSearchKeyword) {
            this.handleSearch();
            this.lastSearchKeyword = newVal;
          }
        }, 500);
      },
      immediate: false
    },
    // 监听抽屉打开状态，修复z-index问题
    drawer: {
      handler(newVal) {
        if (newVal) {
          // 延迟设置z-index，确保DOM已渲染
          this.$nextTick(() => {
            setTimeout(() => {
              const drawerWrapper = document.querySelector('.el-drawer__wrapper');
              const overlay = document.querySelector('.el-overlay-drawer');
              if (drawerWrapper) {
                drawerWrapper.style.zIndex = '9999';
              }
              if (overlay) {
                overlay.style.zIndex = '9998';
              }
            }, 10);
          });
        }
      },
      immediate: false
    }
  },

  methods: {
    async fetchProblems() {
      try {
        this.loading = true;
        const data = await getProblemList(this.problemQueryDTO);
        this.problems = data.records;
        this.problemQueryDTO.total = data.total;
      } catch (error) {
        console.error('获取题目列表失败:', error);
        this.$message.error('获取题目列表失败，请稍后重试');
        this.problems = [];
        this.problemQueryDTO.total = 0;
      } finally {
        this.loading = false;
      }
    },

    async fetchTags() {
      try {
        this.tags = await getAllTags();
      } catch (error) {
        console.error('获取标签列表失败:', error);
        this.$message.error('获取标签列表失败');
        this.tags = [];
      }
    },

    // 搜索处理
    handleSearch() {
      this.problemQueryDTO.page = 1; // 重置到第一页
      this.fetchProblems();
    },

    // 刷新题目列表
    refreshProblems() {
      this.fetchProblems();
    },

    // 重置所有筛选条件
    resetFilters() {
      this.problemQueryDTO = {
        ...this.problemQueryDTO,
        keyword: '',
        tagId: [],
        difficulty: '',
        page: 1
      };
      this.tagSearchKeyword = '';
      this.fetchProblems();
    },

    // 分页处理
    handleCurrentChange(val) {
      this.problemQueryDTO.page = val;
      this.fetchProblems();
    },

    sizeChange(pageSize) {
      this.problemQueryDTO.pageSize = pageSize;
      this.problemQueryDTO.page = 1; // 重置到第一页
      this.fetchProblems();
    },

    // 页面跳转
    jump(url) {
      this.$router.push(url);
    },

    // 表格行点击
    handleRowClick(row) {
      this.jump(`/problem/${row.id}`);
    },

    // 标签相关方法
    openTagDrawer() {
      this.fetchTags();
      this.drawer = true;

      // 立即设置z-index，防止被遮挡
      this.$nextTick(() => {
        setTimeout(() => {
          const drawerWrappers = document.querySelectorAll('.el-drawer__wrapper');
          const overlays = document.querySelectorAll('.v-modal, .el-overlay, .el-overlay-drawer');

          drawerWrappers.forEach(wrapper => {
            wrapper.style.zIndex = '9999';
          });

          overlays.forEach(overlay => {
            overlay.style.zIndex = '9998';
          });
        }, 50);
      });
    },

    removeTag(tagId) {
      this.problemQueryDTO.tagId = this.problemQueryDTO.tagId.filter(id => id !== tagId);
      this.handleSearch();
    },

    clearAllTags() {
      this.problemQueryDTO.tagId = [];
      this.handleSearch();
    },

    getTagName(tagId) {
      const tag = this.tags.find(tag => tag.id === tagId);
      return tag ? tag.name : '未知标签';
    },

    // 通过率格式化
    formatPercentage(percentage) {
      return percentage ? `${percentage}%` : '0%';
    }
  }
}
</script>

<style scoped>
.problem-container {
  padding: 12px;
  background-color: #f8f9fa;
  min-height: calc(100vh - 60px);
}

/* 搜索区域样式 */
.search-section {
  background: white;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 180px;
}

/* 已选择标签样式 */
.selected-tags {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #ebeef5;
  flex-wrap: wrap;
}

.tags-label {
  font-size: 12px;
  color: #606266;
  white-space: nowrap;
}

.selected-tag {
  margin: 0;
}

.clear-all-btn {
  font-size: 11px;
  color: #f56c6c;
  padding: 0;
  margin-left: 4px;
}

/* 抽屉样式 */
.tag-drawer-content {
  padding: 16px;
}

/* 修复抽屉层级问题 */
.tag-drawer {
  z-index: 9999 !important;
}

.tag-drawer .el-drawer__wrapper {
  z-index: 9999 !important;
}

.tag-drawer .el-overlay {
  z-index: 9998 !important;
}

/* 全局修复 Element UI 抽屉层级问题 */
.el-drawer__wrapper {
  z-index: 9999 !important;
}

.el-drawer {
  z-index: 9999 !important;
}

.el-overlay-drawer {
  z-index: 9998 !important;
}

/* 表格区域样式 */
.table-section {
  background: white;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stats-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #fafafa;
  border-bottom: 1px solid #ebeef5;
  font-size: 13px;
}

.stats-text {
  color: #606266;
}

.table-actions {
  display: flex;
  gap: 4px;
}

/* 表格样式 */
.problem-table {
  border: none;
}

.problem-table .el-table__header th {
  padding: 6px 0;
  font-weight: 600;
  color: #303133;
  background-color: #fafafa;
  border-bottom: 1px solid #ebeef5;
  font-size: 13px;
}

.problem-table .el-table__body td {
  padding: 4px 0;
  border-bottom: 1px solid #f5f7fa;
  font-size: 13px;
}

.problem-table .el-table__row:hover>td {
  background-color: #f5f7fa;
}

.problem-title-link {
  font-weight: 500;
  color: #409eff;
  text-decoration: none;
}

.problem-title-link:hover {
  color: #66b1ff;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  align-items: center;
}

.problem-tag {
  margin: 0;
  font-size: 10px;
}

.more-tags {
  font-size: 10px;
  color: #909399;
}

.no-tags {
  font-size: 10px;
  color: #c0c4cc;
  font-style: italic;
}

.acceptance-text {
  font-size: 12px;
  color: #67c23a;
  font-weight: 500;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 30px 20px;
  color: #909399;
}

.empty-state i {
  font-size: 40px;
  color: #c0c4cc;
  margin-bottom: 12px;
}

.empty-state p {
  font-size: 13px;
  margin-bottom: 12px;
  color: #606266;
}

/* 分页样式 */
.pagination-wrapper {
  padding: 12px;
  background: #fafafa;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .problem-container {
    padding: 8px;
  }

  .search-row {
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
  }

  .search-input {
    min-width: auto;
  }

  .selected-tags {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .stats-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  /* 移动端隐藏标签列 */
  .problem-table .el-table__header th:nth-child(3),
  .problem-table .el-table__body td:nth-child(3) {
    display: none;
  }
}

@media (max-width: 480px) {

  /* 移动端隐藏通过率列 */
  .problem-table .el-table__header th:nth-child(5),
  .problem-table .el-table__body td:nth-child(5) {
    display: none;
  }
}

/* 动画效果 */
.search-section,
.table-section {
  transition: box-shadow 0.3s ease;
}

.search-section:hover,
.table-section:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.selected-tag {
  transition: all 0.3s ease;
}

.problem-title-link {
  transition: color 0.3s ease;
}

/* 优化表格行高 */
.problem-table .el-table__body .el-table__row {
  height: 36px;
}

/* 优化按钮样式 */
.el-button--mini {
  padding: 3px 6px;
  font-size: 11px;
}

.el-button--small {
  padding: 5px 8px;
  font-size: 12px;
}

/* Element UI 组件样式覆盖 */
.el-table--small .el-table__cell {
  padding: 4px 0;
}

.el-tag--mini {
  height: 18px;
  line-height: 16px;
  font-size: 10px;
}

.el-switch--small {
  font-size: 11px;
}

.el-pagination--small .el-pagination__sizes .el-input .el-input__inner {
  height: 24px;
  line-height: 24px;
}

.el-pagination--small .el-pager li {
  min-width: 24px;
  height: 24px;
  line-height: 24px;
}
</style>
