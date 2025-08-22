<template>
  <div class="problem-container">
    <!-- 顶部 -->
    <div class="header">
      <h1 class="inline-title">{{ problem.problemId }}</h1>
      <h1 class="inline-title">{{ problem.title }}</h1>
      <el-button-group class="problem-action-btn">
        <el-button v-if="hasPermission(permissions.PROBLEM_UPDATE)"
                   type="primary" size="mini"
                   @click="jump(`/problem/edit/${problem.id}`)">编辑题目
        </el-button>
        <el-button v-if="hasPermission(permissions.PROBLEM_TAG_ADD)"
                   type="primary" size="mini"
                   @click="jump(`/problem/addTag/${problem.id}`)">修改标签
        </el-button>
        <el-button
            v-if="hasPermission(permissions.PROBLEM_ADD_TEST_CASE) && hasPermission(permissions.PROBLEM_DELETE_TEST_CASE)"
            type="primary" size="mini"
            @click="jump(`/problem/editTestCase/${problem.id}`)">测试数据
        </el-button>
      </el-button-group>
    </div>
    <!-- main -->
    <el-row :gutter="20">
      <el-col :span="12">
        <!-- 题目信息 -->
        <div class="problem-info">
          <div class="problem-limits">
            <el-descriptions :column="4" border size="mini">
              <el-descriptions-item label="时间限制">{{ problem.timeLimit / 1000 }}s</el-descriptions-item>
              <el-descriptions-item label="内存限制">{{ problem.memoryLimit }}MB</el-descriptions-item>
              <el-descriptions-item label="创建者">{{ problem.createUser }}</el-descriptions-item>
              <el-descriptions-item label="提交次数">{{ 888 }}</el-descriptions-item>
              <el-descriptions-item label="通过次数">{{ 888 }}</el-descriptions-item>
              <el-descriptions-item label="来源">{{ problem.source }}</el-descriptions-item>
              <el-descriptions-item label="难度"><DifficultyTag :difficulty="problem.difficulty" size="mini"/></el-descriptions-item>
            </el-descriptions>
          </div>
          <el-tag v-for="tag in problem.tags" :key="tag.id" style="margin-right: 10px;">{{ tag.name }}</el-tag>
        </div>
        <!-- 题目内容 -->
        <div class="problem-content">
          <h2>题目描述</h2>
          <markdown-renderer :content="problem.description"></markdown-renderer>
          <h2>输入格式</h2>
          <markdown-renderer :content="problem.inputDescription"></markdown-renderer>
          <h2>输出格式</h2>
          <markdown-renderer :content="problem.outputDescription"></markdown-renderer>
          <h2>样例</h2>
          <el-row :gutter="20">

          <div v-for="(example, index) in problem.examples" :key="index">
            <el-col :span="12">
<!--              <span>输入 #{{index}}</span>-->
              <pre>{{ example.input }}</pre>
            </el-col>
            <el-col :span="12">
<!--              <span>输出 #{{index}}</span>-->
              <pre>{{ example.output }}</pre>
            </el-col>
          </div>
          </el-row>
          <h3>提示</h3>
          <markdown-renderer :content="problem.hint"></markdown-renderer>
        </div>

      </el-col>
      <el-col :span="12">
        <!-- 提交代码 -->
        <div class="problem-submit">
          <el-select v-model="language" placeholder="请选择语言" size="mini">
            <el-option label="Java" value="java"></el-option>
          </el-select>
          <el-button type="primary" :disabled="!isLogin" @click="submitProblem" size="mini">提交代码</el-button>
          <div v-if="!isLogin" style="color: #F56C6C; font-size: 12px;">请登录之后再提交代码</div>
        </div>
        <!-- 代码编辑器 -->
        <div class="code">
          <code-editor v-model="code" :language="language" :height="600"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {getToken} from '@/utils/cookie'
import {getProblemInfo} from '@/api/problem'
import {submitCode} from '@/api/judge'
import DifficultyTag from './components/DifficultyTag.vue'
import {Permissions} from '@/config/permissions'
import {mapState} from "vuex";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import CodeEditor from "@/components/CodeEditor.vue";

export default {
  name: 'ProblemView',
  components: {
    CodeEditor,
    MarkdownRenderer,
    DifficultyTag,
  },
  computed: {
    ...mapState('user', ['userInfo', 'isLogin'])
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
        difficulty: 0,
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
      this.$router.push(url);
    },
    hasPermission(permission) {
      return this.userInfo.permissions.includes(permission);
    }
  }
}
</script>

<style scoped>
.inline-title {
  display: inline;
  margin: 0 5px 0;
}

.problem-action-btn {
  float: right;
  line-height: 40px;
  margin-top: 3px;
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
