<template>
  <div class="edit-problem-container">
    <z-header :back-url="`/problem/${problemForm.id}`" title="编辑题目"></z-header>
    <el-form :model="problemForm" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="题目ID">
            <el-input v-model="problemForm.problemId" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="题目标题">
            <el-input v-model="problemForm.title" size="mini"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="5">
          <el-form-item label="时间限制ms">
            <el-input-number v-model="problemForm.timeLimit" :min="0" :step="500" controls-position="right" size="mini">
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="空间限制MB">
            <el-input-number v-model="problemForm.memoryLimit" :min="0" :step="128" controls-position="right"
              size="mini">
            </el-input-number>
          </el-form-item>
        </el-col>
        <!--        <el-col :span="4">-->
        <!--          <el-form-item label="栈限制MB">-->
        <!--            <el-input-number v-model="problemForm.stackLimit" :min="0" :step="32" controls-position="right" size="mini">-->
        <!--            </el-input-number>-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
        <el-col :span="4">
          <el-form-item label="题目难度">
            <DifficultyOptions v-model="problemForm.difficulty" size="mini"></DifficultyOptions>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="题目权限">
            <el-select v-model="problemForm.status" size="mini">
              <el-option label="公开" value="0"></el-option>
              <el-option label="私有" value="1"></el-option>
              <el-option label="比赛中" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="题目来源">
            <el-input v-model="problemForm.source" placeholder="默认为zzcoder" size="mini"></el-input>
          </el-form-item>
        </el-col>

      </el-row>
      <el-tabs type="card">
        <el-tab-pane label="题目描述">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="题目描述">
                <el-input type="textarea" v-model="problemForm.description" autosize></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <markdown-renderer :content="problemForm.description"></markdown-renderer>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="输入描述">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="输入描述">
                <el-input type="textarea" v-model="problemForm.inputDescription" autosize></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <markdown-renderer :content="problemForm.inputDescription"></markdown-renderer>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="输出描述">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="输出描述">
                <el-input type="textarea" v-model="problemForm.outputDescription" autosize></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <markdown-renderer :content="problemForm.outputDescription"></markdown-renderer>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="提示/说明">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="提示/说明">
                <el-input type="textarea" v-model="problemForm.hint" autosize></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <markdown-renderer :content="problemForm.hint"></markdown-renderer>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <!-- 提交 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">保存修改</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>


  </div>
</template>

<script>
import { getProblemInfo, updateProblem } from '@/api/problem'
import DifficultyOptions from "@/components/DifficultySelect.vue";
import ZHeader from "@/components/ZHeader.vue";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";

export default {
  name: 'EditProblemView',
  components: {
    MarkdownRenderer, ZHeader, DifficultyOptions,
  },
  data() {
    return {
      problemForm: {
        id: '',
        problemId: '',
        title: '',
        timeLimit: 1000,
        memoryLimit: 256,
        stackLimit: 128,
        description: '',
        inputDescription: '',
        outputDescription: '',
        source: 'zzcoder',
        difficulty: NaN,
        hint: '',
        status: '0'
      }
    }
  },
  async mounted() {
    await this.fetchProblem()
  },
  methods: {
    async fetchProblem() {
      this.problemForm = await getProblemInfo(this.$route.params.problemId)
    },
    async submitForm() {
      try {
        await updateProblem(this.problemForm)
        this.$message.success('题目更新成功')
        this.$router.push(`/problem/${this.problemForm.id}`)
      } catch (error) {
        this.$message.error('题目更新失败')
      }
    },
    cancel() {
      this.$router.push(`/problem/${this.problemForm.id}`)
    }
  }
}
</script>

<style scoped>
.edit-problem-container {
  padding: 0 20px 0;
}

.edit-problem-form {
  max-width: 1000px;
  margin: 0 auto;
}
</style>
