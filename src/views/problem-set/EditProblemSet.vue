<template>
  <div class="edit-problem-set-container">
    <z-header :back-url="`/problem-set/${problemSetId}`" title="编辑题单"></z-header>

    <div class="form-container">
      <el-tabs v-model="activeTab" type="card" class="edit-tabs">
        <!-- 基本信息编辑 -->
        <el-tab-pane label="基本信息" name="basic">
          <el-form :model="problemSetForm" :rules="rules" ref="problemSetForm" label-width="100px">
            <!-- 基本信息 -->
            <div class="form-section">
              <h3 class="section-title">基本信息</h3>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="题单标题" prop="title">
                    <el-input v-model="problemSetForm.title" placeholder="请输入题单标题" size="small"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="题单状态">
                    <el-select v-model="problemSetForm.status" placeholder="请选择状态" size="small">
                      <el-option label="私有" :value="0"></el-option>
                      <el-option label="公开" :value="1"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <!-- 描述信息 -->
            <div class="form-section">
              <h3 class="section-title">题单描述</h3>
              <div class="description-section">
                <markdown-editor v-model="problemSetForm.description" :height="500" @change="onDescriptionChange" />
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="form-actions">
              <el-button type="primary" @click="updateBasicInfo" :loading="submitting">
                <i class="el-icon-check"></i> 保存修改
              </el-button>
            </div>
          </el-form>
        </el-tab-pane>

        <!-- 题目管理 -->
        <el-tab-pane name="add-problems">
          <span slot="label">
            <i class="el-icon-plus"></i>
            添加题目
          </span>

          <div class="add-problems-management">
            <el-tabs v-model="addProblemTab" type="border-card" size="small">
              <!-- 添加本站题目 -->
              <el-tab-pane label="本站题目" name="local">
                <div class="add-form">
                  <el-row :gutter="20">
                    <el-col :span="8">
                      <el-input v-model="searchForm.keyword" placeholder="输入题目编号或名称搜索" size="small" clearable
                        @keyup.enter.native="searchLocalProblems" />
                    </el-col>
                    <el-col :span="4">
                      <el-button type="primary" size="small" @click="searchLocalProblems">
                        <i class="el-icon-search"></i> 搜索
                      </el-button>
                    </el-col>
                  </el-row>

                  <!-- 搜索结果 -->
                  <div v-if="searchResults.length > 0" class="search-results">
                    <el-table :data="searchResults" size="small" max-height="300" style="margin-top: 15px;">
                      <el-table-column prop="id" label="ID" width="80"></el-table-column>
                      <el-table-column prop="title" label="题目名称" min-width="200"></el-table-column>
                      <el-table-column label="难度" width="100" align="center">
                        <template #default="scope">
                          <difficulty-tag :difficulty="scope.row.difficulty"></difficulty-tag>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" width="100" align="center">
                        <template #default="scope">
                          <el-button type="text" size="small" @click="addLocalProblem(scope.row)"
                            :disabled="isLocalProblemAdded(scope.row.id)">
                            {{ isLocalProblemAdded(scope.row.id) ? '已添加' : '添加' }}
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </el-tab-pane>

              <!-- 添加外站题目 -->
              <el-tab-pane label="外站题目" name="external">
                <div class="add-form">
                  <el-form :model="externalProblemForm" :rules="externalRules" ref="externalForm" size="small">
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <el-form-item prop="title">
                          <el-input v-model="externalProblemForm.title" placeholder="题目名称"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item prop="platform">
                          <platform-select v-model="externalProblemForm.platform" placeholder="选择平台" size="small"
                            :platforms="['codeforces', 'atcoder', 'leetcode', 'nowcoder', 'luogu']" :show-icon="true"
                            @change="handlePlatformChange" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item prop="difficulty">
                          <el-select v-model="externalProblemForm.difficulty" placeholder="选择难度">
                            <el-option label="简单" :value="1"></el-option>
                            <el-option label="中等" :value="2"></el-option>
                            <el-option label="困难" :value="3"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="4">
                        <el-button type="primary" @click="addExternalProblem">
                          <i class="el-icon-plus"></i> 添加
                        </el-button>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item prop="url">
                          <el-input v-model="externalProblemForm.url" placeholder="题目链接"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item>
                          <el-input v-model="externalProblemForm.description" placeholder="题目描述（可选）"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-tab-pane>

        <!-- 移除题目 -->
        <el-tab-pane name="remove-problems">
          <span slot="label">
            <i class="el-icon-delete"></i>
            移除题目
          </span>

          <div class="remove-problems-management">
            <!-- 当前题目列表 -->
            <div class="current-problems">
              <!-- 本站题目 -->
              <div class="problem-group" v-if="localProblems.length > 0">
                <div class="group-header">
                  <i class="el-icon-medal"></i>
                  <h3>本站题目 ({{ localProblems.length }})</h3>
                </div>
                <el-table :data="localProblems" size="small">
                  <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
                  <el-table-column prop="title" label="题目名称" min-width="200"></el-table-column>
                  <el-table-column label="难度" width="100" align="center">
                    <template #default="scope">
                      <difficulty-tag :difficulty="scope.row.difficulty"></difficulty-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="id" label="题目ID" width="100" align="center"></el-table-column>
                  <el-table-column label="操作" width="120" align="center">
                    <template #default="scope">
                      <el-button type="text" size="small" style="color: #f56c6c;"
                        @click="removeLocalProblem(scope.$index)">
                        移除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <!-- 外站题目 -->
              <div class="problem-group" v-if="externalProblems.length > 0">
                <div class="group-header">
                  <i class="el-icon-link"></i>
                  <h3>外站题目 ({{ externalProblems.length }})</h3>
                </div>
                <el-table :data="externalProblems" size="small">
                  <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
                  <el-table-column prop="title" label="题目名称" min-width="200"></el-table-column>
                  <el-table-column label="平台" width="120" align="center">
                    <template #default="scope">
                      <platform-tag :platform="scope.row.platform.toLowerCase()" :clickable="false" size="small" />
                    </template>
                  </el-table-column>
                  <el-table-column label="难度" width="100" align="center">
                    <template #default="scope">
                      <difficulty-tag :difficulty="scope.row.difficulty"></difficulty-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="120" align="center">
                    <template #default="scope">
                      <el-button type="text" size="small" @click="viewExternalProblem(scope.row.url)">
                        访问
                      </el-button>
                      <el-button type="text" size="small" style="color: #f56c6c;"
                        @click="removeExternalProblem(scope.$index)">
                        移除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <!-- 空状态 -->
              <div v-if="localProblems.length === 0 && externalProblems.length === 0" class="empty-problems">
                <i class="el-icon-folder-opened"></i>
                <p>暂无题目，请先添加题目到题单中</p>
              </div>
            </div>

            <!-- 保存题目更改 -->
            <div class="form-actions" style="margin-top: 30px;">
              <el-button type="primary" @click="saveProblems" :loading="problemsSubmitting">
                <i class="el-icon-check"></i> 保存题目更改
              </el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import ZHeader from '@/components/ZHeader.vue';
import MarkdownEditor from '@/components/MarkdownEditor.vue';
import DifficultyTag from '@/components/DifficultyTag.vue';
import PlatformSelect from '@/components/PlatformSelect.vue';
import PlatformTag from '@/components/PlatformTag.vue';
import {
  getProblemSetDetail,
  updateProblemSet,
  removeInternalProblem,
  removeExternalProblem,
  addInternalProblem,
} from '@/api/problemSet';
import { searchProblems } from '@/api/problem';

export default {
  name: 'EditProblemSet',
  components: { ZHeader, MarkdownEditor, DifficultyTag, PlatformSelect, PlatformTag },
  data() {
    return {
      problemSetId: 0,
      activeTab: 'basic',
      addProblemTab: 'local',

      // 原始数据备份
      originalData: {},

      // 题单基本信息
      problemSetForm: {
        title: '',
        description: '',
        status: 0
      },

      // 题目数据
      localProblems: [],
      externalProblems: [],

      // 搜索相关
      searchForm: {
        keyword: ''
      },
      searchResults: [],

      // 外站题目表单
      externalProblemForm: {
        title: '',
        platform: '',
        difficulty: '',
        url: '',
        description: ''
      },

      // 表单验证规则
      rules: {
        title: [
          { required: true, message: '请输入题单标题', trigger: 'blur' },
          { min: 2, max: 100, message: '标题长度在 2 到 100 个字符', trigger: 'blur' }
        ]
      },

      externalRules: {
        title: [{ required: true, message: '请输入题目名称', trigger: 'blur' }],
        platform: [{ required: true, message: '请选择平台', trigger: 'change' }],
        difficulty: [{ required: true, message: '请选择难度', trigger: 'change' }],
        url: [{ required: true, message: '请输入题目链接', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.fetchProblemSetDetail();
  },
  methods: {
    // 获取题单详情
    async fetchProblemSetDetail() {
      const data = await getProblemSetDetail(this.$route.params.problemSetId);
      this.problemSetId = data.id
      this.problemSetForm = {
        title: data.title,
        description: data.description || '',
        status: data.status
      };
      this.localProblems = data.internalProblems || [];
      this.externalProblems = data.externalProblems || [];
    },

    // 更新基本信息
    async updateBasicInfo() {
      this.$refs.problemSetForm.validate(async (valid) => {
        if (valid) {
          await updateProblemSet(this.problemSetId, this.problemSetForm);
          this.$message.success('基本信息更新成功');
          this.originalData.problemSetForm = JSON.parse(JSON.stringify(this.problemSetForm));
        }
      });
    },

    // 搜索本站题目
    async searchLocalProblems() {
      if (!this.searchForm.keyword.trim()) {
        this.$message.warning('请输入题目编号或名称');
        return;
      }
      this.searchResults = await searchProblems(this.searchForm.keyword);
      if (this.searchResults.length === 0) {
        this.$message.info('未找到相关题目');
      }
    },

    // 检查本站题目是否已添加
    isLocalProblemAdded(problemId) {
      return this.localProblems.some(p => p.id === problemId);
    },

    // 添加本站题目
    async addLocalProblem(problem) {
      if (this.isLocalProblemAdded(problem.id)) {
        this.$message.warning('该题目已添加');
        return;
      }
      await addInternalProblem(this.problemSetId, problem.id);
      this.localProblems.push(problem);
      this.$message.success(`题目"${problem.title}"添加成功`);
    },

    // 添加外站题目
    async addExternalProblem() {
      this.$refs.externalForm.validate(async (valid) => {
        if (valid) {
          const newProblem = {
            id: Date.now().toString(),
            ...this.externalProblemForm
          };

          this.externalProblems.push(newProblem);
          this.$message.success(`题目"${newProblem.title}"添加成功`);

          // 重置表单
          this.$refs.externalForm.resetFields();
          this.externalProblemForm = {
            title: '',
            platform: '',
            difficulty: '',
            url: '',
            description: ''
          };
        }
      });
    },

    // 移除本站题目
    removeLocalProblem(index) {
      const problem = this.localProblems[index];
      this.$confirm(`确定要移除题目"${problem.title}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await removeInternalProblem(this.problemSetId, problem.id);
        this.localProblems.splice(index, 1);
        this.$message.success('题目移除成功');
      });
    },

    // 移除外站题目
    removeExternalProblem(index) {
      const problem = this.externalProblems[index];
      this.$confirm(`确定要移除题目"${problem.title}"���？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await removeExternalProblem(this.problemSetId, problem.id);
        this.externalProblems.splice(index, 1);
        this.$message.success('题目移除成功');
      });
    },

    // 保存题目更改
    async saveProblems() {
      this.problemsSubmitting = true;
      try {
        // 这里应该调用API保存题目列表
        // await updateProblemSetProblems(this.problemSetId, {
        //   localProblems: this.localProblems,
        //   externalProblems: this.externalProblems
        // });

        this.$message.success('题目列表保存成功');
        this.originalData.localProblems = JSON.parse(JSON.stringify(this.localProblems));
        this.originalData.externalProblems = JSON.parse(JSON.stringify(this.externalProblems));
      } catch (error) {
        this.$message.error('保存失败，请重试');
      } finally {
        this.problemsSubmitting = false;
      }
    },

    viewProblem(problemId) {
      window.open(`/problem/${problemId}`, '_blank');
    },

    viewExternalProblem(url) {
      window.open(url, '_blank');
    },

    onDescriptionChange(content) {
      console.log(content)
      // 内容变化处理
    },

    // 处理平台选择变化
    handlePlatformChange(value, platformInfo) {
      console.log('选择的平台:', value, platformInfo);
      // 可以在这里处理平台选择后的逻辑，比如自动填充某些字段
    }
  }
}
</script>

<style scoped>
.edit-problem-set-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.form-container {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.edit-tabs {
  margin-bottom: 20px;
}

.form-section {
  margin-bottom: 30px;
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  border-left: 4px solid #409eff;
  padding-left: 10px;
}

.description-section {
  margin-bottom: 20px;
}

.form-actions {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
  margin-top: 30px;
}

.form-actions .el-button {
  margin: 0 10px;
  min-width: 100px;
}

/* 题目管理样式 */
.problems-management {
  padding-top: 20px;
}

.add-problem-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 6px;
}

.add-form {
  padding: 15px 0;
}

.search-results {
  max-height: 300px;
  overflow-y: auto;
}

.current-problems {
  margin-top: 30px;
}

.problem-group {
  margin-bottom: 30px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
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

.empty-problems {
  text-align: center;
  padding: 40px 20px;
  color: #909399;
}

.empty-problems i {
  font-size: 48px;
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
  .edit-problem-set-container {
    padding: 12px;
  }

  .form-container {
    padding: 20px;
  }

  .add-problem-section {
    padding: 15px;
  }
}
</style>
