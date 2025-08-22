<template>
  <div class="edit-problem-container">
    <div class="header">
      <el-button type="text" @click="cancel" class="back">
        <i class="el-icon-back"></i> 返回
      </el-button>
      <h1 class="title">编辑题目</h1>
    </div>

    <el-form :model="problemForm" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="题目ID">
            <el-input v-model="problemForm.problemId"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="题目标题">
            <el-input v-model="problemForm.title"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="时间限制">
            <el-input-number v-model="problemForm.timeLimit" :min="0" :step="100" controls-position="right">
              <template slot="append">ms</template>
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="空间限制">
            <el-input-number v-model="problemForm.memoryLimit" :min="0" :step="32" controls-position="right">
              <template slot="append">MB</template>
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="栈限制">
            <el-input-number v-model="problemForm.stackLimit" :min="0" :step="32" controls-position="right">
              <template slot="append">MB</template>
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="题目难度">
<!--            <el-select v-model="problemForm.difficulty">-->
<!--              <el-option v-for="item in difficultyOptions"-->
<!--                         :key="item.value"-->
<!--                         :label="item.label"-->
<!--                         :value="item.value">-->
<!--              </el-option>-->
<!--            </el-select>-->
            <DifficultyOptions v-model="problemForm.difficulty"></DifficultyOptions>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="题目权限">
            <el-select v-model="problemForm.status">
              <el-option label="公开" value="0"></el-option>
              <el-option label="私有" value="1"></el-option>
              <el-option label="比赛中" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="题目来源">
            <el-input v-model="problemForm.source" placeholder="默认为zzcoder"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="题目描述">
            <el-input type="textarea" v-model="problemForm.description" rows="6"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <markdown-renderer :content="problemForm.description"></markdown-renderer>
        </el-col>

        <el-col :span="12">


          <el-form-item label="输入描述">
            <el-input type="textarea" v-model="problemForm.inputDescription" rows="4"></el-input>
          </el-form-item>

          <el-form-item label="输出描述">
            <el-input type="textarea" v-model="problemForm.outputDescription" rows="4"></el-input>
          </el-form-item>

          <el-form-item label="提示">
            <el-input type="textarea" v-model="problemForm.hint" rows="4"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm">保存修改</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-form-item>
          <!--        </el-card>-->
        </el-col>
        <el-col :span="12">
        </el-col>
      </el-row>
    </el-form>


    <!--        </el-card>-->
  </div>
</template>

<script>
import {getProblemInfo, updateProblem} from '@/api/problem'
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import DifficultyOptions from "@/components/DifficultyOptions.vue";

export default {
  name: 'EditProblemView',
  components: {DifficultyOptions, MarkdownRenderer},
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
        difficulty: 0,
        hint: '',
        status: '0'
      },
      difficultyOptions: [{
        value: '0',
        label: '入门'
      }, {
        value: '1',
        label: '简单'
      }, {
        value: '2',
        label: '简单+'
      }, {
        value: '3',
        label: '中等'
      }, {
        value: '4',
        label: '中等+'
      }, {
        value: '5',
        label: '困难'
      }, {
        value: '6',
        label: '困难+'
      }]
    }
  },
  async mounted() {
    await this.fetchProblem()
  },
  methods: {
    async fetchProblem() {
      this.problemForm = await getProblemInfo(this.$route.params.id)
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
  padding: 20px;
}

.edit-problem-form {
  max-width: 1000px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center; /* 垂直居中 */
  position: relative; /* 方便绝对定位按钮 */
  justify-content: center; /* 让标题在水平居中 */
  margin-bottom: 20px; /* 底部留出空间 */
}

.header .title {
  margin: 0;
}

.header .back {
  position: absolute; /* 让返回按钮固定在左边 */
  left: 0;
}
</style>
