<template>
  <div class="problem-info">
    <z-header back-url="/problem-set" title="题单详情"></z-header>
    <h1>标题</h1>
    <el-descriptions :column="2" border>
      <el-descriptions-item label="创建者">

      </el-descriptions-item>
      <el-descriptions-item label="创建时间">

      </el-descriptions-item>
      <el-descriptions-item>

      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import {getProblemSet} from '@/api/problemSet';
import ZHeader from "@/components/ZHeader.vue";

export default {
  name: 'ProblemSetInfoView',
  components: {ZHeader},
  data() {
    return {
      title: '标题标题',
      description: '描述描述',
      createUser: 'zazhi',
      createTime: '1111-11-11 11:11:11',
      problems: [],
    };
  },
  async mounted() {
    // await this.fetchProblemSet();
  },
  methods: {
    async fetchProblemSet() {
      const id = this.$route.params.id;
      try {
        const data = await getProblemSet(id);
        this.problems = data.problems;
        this.title = data.title;
        this.description = data.description;
        this.createUser = data.createUser;
        this.createTime = data.createTime;
      } catch (error) {
        this.$message.error("获取题单失败");
        console.error("获取题单失败", error);
      }
    },
    jump(url) {
      this.$router.replace(url);
    },
  },
};
</script>

<style scoped>
.problem-info {
  margin: 20px;
}
</style>
