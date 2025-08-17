<template>
  <div class="problem-container">
    <el-card class="problem-detail">
      <div slot="header">
        <span>{{ problem.title }}</span>
        <!-- TODO: 细分权限管理 -->
        <el-button v-if="hasPermission(permissions.PROBLEM_TAG_ADD)" class="problem-action-btn" type="text"
                   @click="jump(`/problem/addTag/${problem.id}`)">修改标签
        </el-button>
        <el-button
            v-if="hasPermission(permissions.PROBLEM_ADD_TEST_CASE) && hasPermission(permissions.PROBLEM_DELETE_TEST_CASE)"
            class="problem-action-btn" type="text"
            @click="jump(`/problem/editTestCase/${problem.id}`)">测试数据
        </el-button>
        <el-button v-if="hasPermission(permissions.PROBLEM_UPDATE)" class="problem-action-btn" type="text"
                   @click="jump(`/problem/edit/${problem.id}`)">编辑题目
        </el-button>

      </div>
      <!-- 题目信息 -->
      <div class="problem-info">
        <el-tag v-for="tag in problem.tags" :key="tag.id" style="margin-right: 10px;">{{ tag.name }}</el-tag>
        <DifficultyTag :difficulty="problem.difficulty"/>
        <div class="problem-limits">
          <el-tag type="info">时间限制: {{ problem.timeLimit / 1000 }}s</el-tag>
          <el-tag type="info">内存限制: {{ problem.memoryLimit }}MB</el-tag>
          <!-- <el-tag type="info">栈限制: {{ problem.stackLimit }}MB</el-tag> -->
        </div>
        <div class="problem-source" v-if="problem.source">
          <span>来源: {{ problem.source }}</span>
        </div>
      </div>
      <!-- 题目内容 -->
      <div class="problem-content">
        <h3>题目描述</h3>
        <div v-html="problem.description"></div>

        <h3>输入格式</h3>
        <div v-html="problem.inputDescription"></div>

        <h3>输出格式</h3>
        <div v-html="problem.outputDescription"></div>

        <h3>样例</h3>
        <div v-for="(example, index) in problem.examples" :key="index">
          <h4>样例 {{ index + 1 }}</h4>
          <pre>输入: {{ example.input }}</pre>
          <pre>输出: {{ example.output }}</pre>
        </div>

        <h3>提示</h3>
        <div v-html="problem.hint"></div>
      </div>

      <!-- 提交代码 -->
      <div class="problem-submit">
        <el-button type="primary" @click="submitProblem">提交代码</el-button>
      </div>
      <!-- 代码编辑器 -->
      <div class="code-editor">
        <el-form>
          <el-form-item label="代码语言">
            <el-select v-model="language" placeholder="请选择语言" :disabled="!token">
              <!-- <el-option label="C++" value="cpp"></el-option> -->
              <el-option label="Java" value="java"></el-option>
              <!-- <el-option label="Python" value="python"></el-option> -->
            </el-select>
            <div v-if="!token" style="color: #F56C6C; font-size: 12px;">请先登录后再选择语言</div>
            <!-- <button @click="changeTheme">Toggle Theme</button> -->
          </el-form-item>

          <el-form-item label="代码">
            <el-input type="textarea" v-model="code" :rows="10" :autosize="{ minRows: 10 }"
                      :disabled="!token"/>
            <!-- <codeEditor v-model="code" :language="language" /> -->
            <div v-if="!token" style="color: #F56C6C; font-size: 12px;">请先登录后再编写代码</div>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import {getToken} from '@/utils/cookie'
import {getProblemInfo} from '@/api/problem'
import {submitCode} from '@/api/judge'
import DifficultyTag from './components/difficultyTag.vue'
import {Permissions} from '@/config/permissions'
import {mapState} from "vuex";

export default {
  name: 'ProblemView',
  components: {
    DifficultyTag,
  },
  computed: {
    ...mapState('user', ['userInfo'])
  },
  data() {
    return {
      problem: {
        id: '',
        problemId: '',
        title: '',
        timeLimit: '',
        memoryLimit: '',
        stackLimit: '',
        description: '',
        inputDescription: '',
        outputDescription: '',
        examples: [],
        hint: '',
        difficulty: '',
        createUser: '',
        source: '',
        tags: []
      },
      language: 'Java',
      code: '',
      token: getToken(),
      theme: "vs-dark",
      editorOptions: {
        fontSize: 16,
      },
      permissions: Permissions
    }
  },
  async mounted() {
    await this.fetchProblem();
  },
  methods: {
    async fetchProblem() {
      this.problem = await getProblemInfo(this.$route.params.id);
    },
    async submitProblem() {
      try {
        await submitCode({
          userId: this.userInfo.id,
          problemId: this.$route.params.id,
          code: this.code,
          language: this.language
        })
        this.$message.success('提交成功')
        this.$router.push('/problem/judge-result/' + this.problem.id)
      } catch (error) {
        this.$message.error('提交失败，请稍后再试')
        console.log(error)
      }
    },
    jump(url) {
      this.$router.replace(url);
    },
    hasPermission(permission) {
      return this.userInfo.permissions.includes(permission);
    }
  }
}
</script>

<style scoped>
.problem-action-btn {
  margin: 0 10px 0 10px;
  float: right;
}

.problem-detail {
  margin-bottom: 20px;
}

.problem-info {
  margin: 20px 0;
}

.problem-limits {
  margin: 10px 0;
}

.problem-limits .el-tag {
  margin-right: 10px;
}

.problem-source {
  margin: 10px 0;
  color: #666;
}

.problem-content {
  margin: 20px 0;
}

.problem-content h3 {
  margin: 20px 0 10px 0;
}

.problem-content pre {
  background-color: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
}

.problem-submit {
  margin-top: 20px;
  text-align: right;
}
</style>
