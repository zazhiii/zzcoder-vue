<template>
  <div class="add-problem-set-container">
    <z-header :back-url="`/problem-set`" title="创建题单"></z-header>

    <div class="form-container">
      <el-form :model="problemSetForm" :rules="rules" ref="problemSetForm" label-width="100px">
        <!-- 基本信息 -->
        <div class="form-section">
          <h3 class="section-title">基本信息</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="题单标题" prop="title">
                <el-input
                  v-model="problemSetForm.title"
                  placeholder="请输入题单标题"
                  size="small"
                ></el-input>
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
            <markdown-editor
              v-model="problemSetForm.description"
              :height="500"
              placeholder="请输入题单描述，支持 Markdown 和 LaTeX 语法

示例：
# 题单介绍
这是一个精心设计的算法练习题单。

## 学习目标
- 掌握基础算法
- 提升编程能力
- 培养算法思维

## 数学公式示例
行内公式：$f(x) = x^2 + 1$

块级公式：
$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

> **提示**：建议按照从易到难的顺序安排题目"
              @change="onDescriptionChange"
            />
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <el-button type="primary" @click="submitForm" :loading="submitting">
            <i class="el-icon-check"></i> 保存题单
          </el-button>
          <el-button @click="cancel">
            <i class="el-icon-close"></i> 取消
          </el-button>
          <el-button type="info" @click="resetForm">
            <i class="el-icon-refresh"></i> 重置
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import ZHeader from '@/components/ZHeader.vue';
import MarkdownEditor from '@/components/MarkdownEditor.vue';
import { addProblemSet } from '@/api/problemSet';

export default {
  name: 'AddProblemSet',
  components: { ZHeader, MarkdownEditor },
  data() {
    return {
      submitting: false,
      problemSetForm: {
        title: '',
        description: '',
        status: 0
      },
      rules: {
        title: [
          { required: true, message: '请输入题单标题', trigger: 'blur' },
          { min: 2, max: 100, message: '标题长度在 2 到 100 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async submitForm() {
      this.$refs.problemSetForm.validate(async (valid) => {
        if (valid) {
          this.submitting = true;
          try {
            await addProblemSet(this.problemSetForm);
            this.$message.success('题单创建成功');
            this.$router.push('/problem-set');
          } catch (error) {
            this.$message.error('创建失败，请重试');
          } finally {
            this.submitting = false;
          }
        }
      });
    },
    cancel() {
      this.$router.back();
    },
    resetForm() {
      this.$refs.problemSetForm.resetFields();
      this.problemSetForm.description = '';
    },
    onDescriptionChange(content) {
      // 可以在这里添加防抖逻辑来优化性能
      console.log('描述内容变化:', content);
    }
  }
}
</script>

<style scoped>
.add-problem-set-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.form-container {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin: 0 auto;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .add-problem-set-container {
  }

  .split-right {
    height: 300px;
  }
}
</style>