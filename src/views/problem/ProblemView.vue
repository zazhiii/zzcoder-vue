<template>
  <div class="problem-container">
    <!-- 顶部 -->
    <div class="header">
      <h1 class="inline-title">{{ problem.problemId }}</h1>
      <h1 class="inline-title">{{ problem.title }}</h1>
      <el-button-group class="problem-action-btn">
        <el-button v-if="hasPermission(permissions.PROBLEM_UPDATE)" type="primary" size="mini"
          @click="jump(`/problem/${problem.id}/edit`)">编辑题目
        </el-button>
        <el-button v-if="hasPermission(permissions.PROBLEM_TAG_ADD)" type="primary" size="mini"
          @click="jump(`/problem/${problem.id}/add-tag`)">修改标签
        </el-button>
        <el-button
          v-if="hasPermission(permissions.PROBLEM_ADD_TEST_CASE) && hasPermission(permissions.PROBLEM_DELETE_TEST_CASE)"
          type="primary" size="mini" @click="jump(`/problem/${problem.id}/edit-test-case`)">测试数据
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
              <el-descriptions-item label="提交次数">{{ 888 }}</el-descriptions-item>
              <el-descriptions-item label="通过次数">{{ 888 }}</el-descriptions-item>
              <el-descriptions-item label="创建者">
                <el-link type="">{{ problem.createUser }}</el-link>
              </el-descriptions-item>
              <el-descriptions-item label="来源">{{ problem.source }}</el-descriptions-item>
              <el-descriptions-item label="难度">
                <DifficultyTag :difficulty="problem.difficulty" size="mini" />
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <el-tag v-for="tag in problem.tags" :key="tag.id" style="margin-right: 10px;">{{ tag }}</el-tag>
        </div>
        <!-- 题目内容 -->
        <div class="problem-content">
          <h1>题目描述</h1>
          <markdown-renderer :content="problem.description"></markdown-renderer>
          <h1>输入格式</h1>
          <markdown-renderer :content="problem.inputDescription"></markdown-renderer>
          <h1>输出格式</h1>
          <markdown-renderer :content="problem.outputDescription"></markdown-renderer>
          <h1>样例</h1>
          <el-row :gutter="20">
            <div v-for="(example, index) in problem.samples" :key="index">
              <el-col :span="12">
                <span>输入 {{ index + 1 }}</span>
                <el-button @click="copyToClipboard(example.input)" size="mini" style="margin-left: 20px;">复制</el-button>
                <pre>{{ example.input }}</pre>
              </el-col>
              <el-col :span="12">
                <span>输出 {{ index + 1 }}</span>
                <el-button @click="copyToClipboard(example.output)" size="mini"
                  style="margin-left: 20px;">复制</el-button>
                <pre>{{ example.output }}</pre>
              </el-col>
            </div>
          </el-row>
          <h1>提示/说明</h1>
          <markdown-renderer :content="problem.hint"></markdown-renderer>
        </div>

      </el-col>
      <el-col :span="12">
        <el-tabs type="card" v-model="activeName" @tab-click="handleSwitch">
          <el-tab-pane label="代码" name="code">
            <div class="problem-submit">
              <el-select v-model="language" placeholder="请选择语言" size="mini">
                <el-option label="Java" value="java"></el-option>
              </el-select>
              <el-button type="primary" :disabled="!isLogin" @click="submit" size="mini">提交代码</el-button>
              <div v-if="!isLogin" style="color: #F56C6C; font-size: 12px;">请登录之后再提交代码</div>
            </div>
            <code-editor v-model="code" :language="language" :height="800" />
          </el-tab-pane>
          <el-tab-pane label="提交记录" name="submission">
            <div class="submission-list">
              <el-table :data="submissions" style="width: 100%">
                <el-table-column label="状态" :filters="statusFilters" width="115"
                  :filter-method="(value, row) => row.status === value">
                  <template v-slot="scope">
                    <judge-status :status="scope.row.status" />
                  </template>
                </el-table-column>
                <el-table-column prop="language" label="语言" width="115" :filters="languageFilters"
                  :filter-method="(value, row) => row.language === value" />
                <el-table-column prop="timeUsed" label="时间消耗">
                  <template v-slot="scope">
                    {{ scope.row.timeUsed }} ms
                  </template>
                </el-table-column>
                <el-table-column prop="memoryUsed" label="内存消耗">
                  <template v-slot="scope">
                    {{ Math.round(scope.row.memoryUsed / 1024 * 100) / 100 }} MB
                  </template>
                </el-table-column>
                <el-table-column label="提交时间">
                  <template v-slot="scope">
                    {{ new Date(scope.row.submitTime).toLocaleString('zh-CN') }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="结果" name="result" closable>
            <div class="test-header">
              <h1 class="test-title">测评中</h1>
            </div>
            <el-row :gutter="10">
              <el-col :span="4" v-for="n in 6" :key="n">
                <div class="test-case"></div>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getToken } from '@/utils/cookie'
import { getProblemInfo } from '@/api/problem'
import { submitCode } from '@/api/judge'
import DifficultyTag from '../../components/DifficultyTag.vue'
import { Permissions } from '@/config/permissions'
import { mapState } from "vuex";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import CodeEditor from "@/components/CodeEditor.vue";
import JudgeStatus from "@/components/JudgeStatus.vue";
import { getUserProblemSubmissions } from '@/api/judge'

export default {
  name: 'ProblemView',
  components: {
    CodeEditor,
    JudgeStatus,
    MarkdownRenderer,
    DifficultyTag,
  },
  computed: {
    ...mapState('user', ['userInfo', 'isLogin'])
  },
  data() {
    return {
      activeName: 'code',
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
        tags: [],
      },
      language: 'Java',
      code: '',
      token: getToken(),
      submissions: [],
      languageFilters: [{ text: 'C', value: 'C' }, { text: 'C++', value: 'C++' }, { text: 'Java', value: 'Java' }],
      statusFilters: [
        { text: '等待中', value: 'PENDING' },
        { text: '评测中', value: 'JUDGING' },
        { text: '答案正确', value: 'AC' },
        { text: '错误答案', value: 'WA' },
        { text: '超出时间限制', value: 'TLE' },
        { text: '超出内存限制', value: 'MLE' },
        { text: '运行错误', value: 'RE' },
        { text: '编译错误', value: 'CE' },
        { text: '系统错误', value: 'SE' }
      ],
      permissions: Permissions
    }
  },
  mounted() {
    this.fetchProblem();
  },
  methods: {
    handleSwitch(tab) {
      if (tab.name === 'submission') {
        this.fetchSubmissions();
      } else if (tab.name === 'result') {
        console.log('show result'); // TODO
      }
    },
    async fetchProblem() {
      this.problem = await getProblemInfo(this.$route.params.id);
    },
    async fetchSubmissions() {
      this.submissions = await getUserProblemSubmissions(this.$route.params.id);
    },
    async submit() {
      try {
        await submitCode({
          problemId: this.$route.params.id,
          code: this.code,
          language: this.language,
          fullJudge: true
        })
        this.$message.success('提交成功')
        this.activeName = 'submission'// TODO
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
    },
    copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        this.$message.success('复制成功');
      }).catch(() => {
        this.$message.error('复制失败');
      });
    }
  }
}
</script>

<style scoped>
.test-header {
  display: flex;
  align-items: center;
  /* 垂直居中 */
  position: relative;
  /* 方便绝对定位按钮 */
  justify-content: center;
  /* 让标题在水平居中 */
  margin-bottom: 20px;
  /* 底部留出空间 */
}

.test-header .test-title {
  margin: 0;
}

.test-header .test-back {
  position: absolute;
  /* 让返回按钮固定在左边 */
  left: 0;
}

.test-case {
  width: 100px;
  height: 100px;
  background-color: #f5f5f5;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 10px;
}

.right-panel {
  /* padding: 20px; */
  /* background-color: #f9f9f9; */
  /* border-left: 1px solid #eee; */
  position: fixed;
  top: 100px;
  bottom: 0;
  right: 0;
  /* overflow-y: auto; */
}

.inline-title {
  display: inline;
  margin: 0 5px 0;
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
  text-align: right;
}
</style>
