<template>
  <div class="problem-container">
    <div class="head">
      <el-row :gutter="20">
        <!-- 标签选择 -->
        <el-col :span="2">
          <el-button @click="drawer = true; fetchTags()" size="mini">选择标签</el-button>
          <el-drawer title="选择标签" :visible.sync="drawer" direction="ltr" size="50%">
            <el-checkbox-group v-model="problemQueryDTO.tagId">
              <el-checkbox border v-for="tag in tags" :label="tag.id" :key="tag.id">
                {{ tag.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-drawer>
        </el-col>
        <!-- 难度选择 -->
        <el-col :span="4">
          <DifficultyOptions v-model="problemQueryDTO.difficulty" size="mini"></DifficultyOptions>
        </el-col>
        <!-- 关键词搜索 -->
        <el-col :span="4">
          <el-input placeholder="输入题目或题号" v-model="problemQueryDTO.keyword" size="mini"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-search" @click="fetchProblems" size="mini">搜索</el-button>
        </el-col>
        <el-col :span="4">
          <!-- 是否展示标签 -->
          <el-switch v-model="showTags" active-text="显示标签" inactive-text="隐藏标签">
          </el-switch>
        </el-col>
        <!-- 添加题目 -->
        <el-col :span="4" :offset="4">
          <el-button v-if="userInfo.permissions.includes('problem:add')" size="mini" type="primary"
            @click="jump(`/problem/add`)">添加题目
          </el-button>
        </el-col>
      </el-row>

    </div>
    <!-- 已选择的标签 -->
    <div style="margin-top: 10px;">
      <el-tag v-for="tagId in problemQueryDTO.tagId" :key="tagId" closable
        @close="problemQueryDTO.tagId = problemQueryDTO.tagId.filter(id => id !== tagId)" style="margin-right: 10px;">
        {{tags.find(tag => tag.id === tagId)?.name}}
      </el-tag>
    </div>
    <!-- 题目列表 -->
    <el-table :data="problems" style="width: 100%">
      <el-table-column prop="problemId" label="题号" width="80"></el-table-column>
      <el-table-column prop="title" label="标题">
        <template slot-scope="scope">
          <el-link type="primary" @click="jump(`/problem/${scope.row.id}`)">
            {{ scope.row.title }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="tags" :label="showTags ? '标签' : ''">
        <template v-slot="scope" v-if="showTags">
          <el-tag v-for="(tag, index) in scope.row.tags" :key="index" size="mini">{{ tag }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="difficulty" label="难度" width="100">
        <template v-slot="scope">
          <DifficultyTag :difficulty="scope.row.difficulty" />
        </template>
      </el-table-column>
      <el-table-column prop="acceptance" label="通过率" width="100">{{ 88.88 }}</el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination @current-change="handleCurrentChange" @size-change="sizeChange"
        :current-page="problemQueryDTO.currentPage" :page-sizes="[5, 15, 10, 20, 50]" :page-size="problemQueryDTO.limit"
        layout="prev, pager, next, jumper, sizes, ->, total" :total="problemQueryDTO.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getAllTags, getProblemList } from '@/api/problem';
import { mapState } from "vuex";
import DifficultyOptions from "@/components/DifficultyOptions.vue"
import DifficultyTag from './components/DifficultyTag.vue';

export default {
  name: 'ProblemListView',
  components: {
    DifficultyOptions,
    DifficultyTag
  },
  computed: {
    ...mapState('user', ['isLogin', 'userInfo']),
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
      },
      drawer: false,
      problems: [],
      tags: [],
      showTags: true,
    }
  },
  created() {
    this.fetchProblems();
  },
  methods: {
    async fetchProblems() {
      const data = await getProblemList(this.problemQueryDTO);
      this.problems = data.records;
      this.problemQueryDTO.total = data.total;
    },
    async fetchTags() {
      this.tags = await getAllTags();
    },
    handleCurrentChange(val) {
      this.problemQueryDTO.page = val;
      this.fetchProblems();
    },
    sizeChange(pageSize) {
      this.problemQueryDTO.pageSize = pageSize
      this.fetchProblems()
    },
    jump(url) {
      this.$router.push(url);
    },
  }
}
</script>

<style scoped>
.pagination {
  margin-top: 20px;
  text-align: center;
}
</style>
