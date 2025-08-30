<template>
  <div class="page-container">
    <el-tabs type="card" v-model="activeName">
      <!-- 公开题单 -->
      <el-tab-pane label="公开题单" name="public">
        <!-- 搜索区域 -->
        <div class="search-bar">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-input
                  placeholder="搜索题单名称"
                  v-model="publicPageParam.title"
                  size="mini"
                  prefix-icon="el-icon-search"
                  clearable
                  @keyup.enter.native="fetchPublicProblemSets"
              ></el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" icon="el-icon-search" @click="fetchPublicProblemSets" size="mini">
                搜索
              </el-button>
            </el-col>
          </el-row>
        </div>

        <!-- 题单表格 -->
        <el-table
            :data="publicProblemSets"
            style="width: 100%;"
            v-loading="publicLoading"
            empty-text="暂无公开题单"
        >
          <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
          <el-table-column prop="title" label="题单名称" min-width="200">
            <template slot-scope="scope">
              <el-link @click="viewProblemSet(scope.row.id)" type="primary">
                {{ scope.row.title }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="创建者" width="120" align="center">
            <template v-slot="scope">
              <el-link type="primary">
                <i class="el-icon-user"></i>
                {{ scope.row.createUserName }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="problemCount" label="题目数量" width="100" align="center"></el-table-column>
          <el-table-column label="创建时间" width="180" align="center">
            <template slot-scope="scope">
              <div class="time-info">
                <i class="el-icon-time"></i>
                <span>{{ new Date(scope.row.createTime).toLocaleDateString() }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container" v-if="publicTotal > 0">
          <el-pagination
              :hide-on-single-page="true"
              @current-change="handlePublicPageChange"
              :current-page="publicPageParam.page"
              :page-size="pageSize"
              layout="total, prev, pager, next, jumper"
              :total="publicTotal"
          ></el-pagination>
        </div>
      </el-tab-pane>

      <!-- 我的题单 -->
      <el-tab-pane label="我的题单" name="my">
        <div class="tab-section">
          <!-- header -->
          <div class="section-header">
            <h3>我的题单</h3>
            <p>管理和创建属于你的题目集合</p>
            <el-button
                type="primary"
                size="mini"
                icon="el-icon-plus"
                @click="createProblemSet"
                class="create-btn"
            >
              创建题单
            </el-button>
          </div>

          <!-- 题单表格 -->
          <el-table
              :data="myProblemSets"
              style="width: 100%;"
              v-loading="myLoading"
              class="problem-set-table my-table"
              empty-text="您还没有创建任何题单"
          >
            <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
            <el-table-column prop="title" label="题单名称" min-width="200">
              <template v-slot="scope">
                <el-link @click="viewProblemSet(scope.row.id)" type="primary">{{ scope.row.title }}</el-link>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="80" align="center">
              <template v-slot="scope">
                <el-tag v-if="scope.row.status === 1" type="success" size="mini">
                  <i class='el-icon-unlock'></i>公开
                </el-tag>
                <el-tag v-else type="info" size="mini">
                  <i class='el-icon-lock'></i>私有
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="problemCount" label="题目数量" width="100" align="center">
            </el-table-column>
            <el-table-column label="创建时间" width="160" align="center">
              <template slot-scope="scope">
                <div class="time-info">
                  <i class="el-icon-time"></i>
                  <span>{{ new Date(scope.row.createTime).toLocaleDateString() }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center" fixed="right">
              <template v-slot="scope">
                <el-button
                    type="text"
                    size="small"
                    @click="editProblemSet(scope.row.id)"
                    class="action-btn"
                >
                  <i class="el-icon-edit"></i> 编辑
                </el-button>
                <el-button
                    type="text"
                    size="small"
                    @click="deleteProblemSet(scope.row)"
                    class="action-btn delete-btn"
                >
                  <i class="el-icon-delete"></i> 删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 空状态 -->
          <div v-if="myProblemSets.length === 0 && !myLoading" class="empty-state">
            <i class="el-icon-folder-add"></i>
            <p>您还没有创建任何题单</p>
            <el-button type="primary" @click="createProblemSet">立即创建</el-button>
          </div>

          <!-- 分页 -->
          <div class="pagination-container" v-if="myTotal > 0">
            <el-pagination
                hide-on-single-page
                @current-change="handleMyPageChange"
                :current-page="myCurrentPage"
                :page-size="pageSize"
                layout="total, prev, pager, next, jumper"
                :total="myTotal"
            ></el-pagination>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {deleteProblemSet, pageProblemSet} from '@/api/problemSet';
import {mapState} from "vuex";

export default {
  name: 'PageProblemSet',
  computed: {
    ...mapState('user', ['isLogin'])
  },
  data() {
    return {
      activeName: 'public',
      // 公开题单数据
      publicPageParam: {
        page: 1,
        title: ''
      },
      publicTotal: 0,
      publicProblemSets: [],
      publicCurrentPage: 1,

      // 我的题单数据
      myProblemSets: [],
      myCurrentPage: 1,
      myTotal: 0,

      pageSize: 10
    }
  },
  mounted() {
    this.fetchPublicProblemSets();
    if (this.isLogin) {
      this.fetchMyProblemSets();
    }
  },
  methods: {
    // 获取公开题单
    async fetchPublicProblemSets() {
      const data = await pageProblemSet({
        ...this.publicPageParam,
        status: 1
      });
      this.publicProblemSets = data.records;
      this.publicTotal = data.total;
    },

    // 获取我的题单
    async fetchMyProblemSets() {
      const data = await pageProblemSet({page: this.myCurrentPage});
      this.myProblemSets = data.records;
      this.myTotal = data.total;
    },

    // 分页处理
    handlePublicPageChange(page) {
      this.publicPageParam.page = page;
      this.fetchPublicProblemSets();
    },

    handleMyPageChange(page) {
      this.myCurrentPage = page;
      this.fetchMyProblemSets();
    },

    // 查看题单详情
    viewProblemSet(id) {
      this.$router.push(`/problem-set/${id}`);
    },

    // 创建题单
    createProblemSet() {
      this.$router.push('/problem-set/add');
    },

    // 编辑题单
    editProblemSet(id) {
      this.$router.push(`/problem-set/edit/${id}`);
    },

    // 删除题单
    async deleteProblemSet(problemSet) {
      this.$confirm(`确定要删除题单"${problemSet.title}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try{
          await deleteProblemSet(problemSet.id);
          this.$message.success('删除成功');
          this.fetchMyProblemSets();
        }catch(error){
          this.$message.error("删除失败");
        }
      });
    }
  }
}
</script>

<style scoped>
.tab-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-header {
  margin-bottom: 24px;
  position: relative;
}

.section-header h3 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.section-header p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.create-btn {
  position: absolute;
  top: 0;
  right: 0;
}

.search-bar {
  margin-bottom: 24px;
  border-radius: 6px;
}

.problem-set-table :deep(.el-table__row) {
  cursor: pointer;
}

.problem-set-table :deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}

.my-table :deep(.el-table__row) {
  cursor: default;
}


.description-text {
  color: #606266;
  line-height: 1.4;
}

.creator-info,
.time-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 14px;
  color: #606266;
}

.creator-info i,
.time-info i {
  color: #909399;
}

.action-btn {
  margin: 0 4px;
}

.delete-btn {
  color: #f56c6c;
}

.delete-btn:hover {
  color: #f78989;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}

.empty-state i {
  font-size: 64px;
  margin-bottom: 16px;
  display: block;
  color: #c0c4cc;
}

.empty-state p {
  margin: 0 0 16px 0;
  font-size: 16px;
}

.pagination-container {
  margin-top: 24px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-container {
    padding: 12px;
  }

  .tab-section {
    padding: 16px;
  }

  .section-header {
    text-align: center;
  }

  .create-btn {
    position: static;
    margin-top: 16px;
  }

}

/* 表格在小屏幕下的优化 */
@media (max-width: 992px) {
  .problem-set-table :deep(.el-table__header-wrapper) {
    font-size: 13px;
  }

  .problem-set-table :deep(.el-table__body-wrapper) {
    font-size: 13px;
  }
}
</style>
