<template>
  <div class="problem-set-container">
    <el-tabs type="card" v-model="activeName">
      <el-tab-pane label="公开题单" name="public" active>
        <div class="head">
          <el-row :gutter="20">
            <!-- 关键词搜索 -->
            <el-col :span="6">
              <el-input placeholder="输入题单名称" v-model="queryForm.title" size="mini"></el-input>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" icon="el-icon-search" @click="fetchProblemSet" size="mini">搜索</el-button>
            </el-col>
            <!-- 添加题单 -->
            <el-col :span="4" :offset="12">
              <el-button size="mini" type="primary" @click="jump('/problem-set/add')">添加题单</el-button>
            </el-col>
          </el-row>
        </div>
        <!-- 题单列表 -->
        <el-table :data="problemSets" style="width: 100%; margin-top: 20px;">
          <el-table-column prop="id" label="ID" width="80"></el-table-column>
          <el-table-column prop="title" label="名称">
            <template v-slot="scope">
              <el-link type="primary" @click="jump(`/problem-set/${scope.row.id}`)">
                {{ scope.row.title }}
              </el-link>
            </template>
          </el-table-column>
          <!--          <el-table-column prop="description" label="描述"></el-table-column>-->
          <el-table-column label="创建者" width="180">
            <template v-slot="scope">
              <el-link type="primary" @click="jump('/user/' + scope.row.createUserId)">
                {{ scope.row.createUserName }}
              </el-link>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
              @current-change="handleCurrentChange"
              @size-change="sizeChange"
              :current-page="queryForm.page"
              :page-sizes="[5, 10, 20, 50]"
              :page-size="queryForm.pageSize"
              layout="prev, pager, next, jumper, sizes, ->, total"
              :total="total"
          >
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="我的题单" name="my">
        <el-table :data="myProblemSets" style="width: 100%; margin-top: 20px;">
          <el-table-column prop="id" label="ID" width="80"></el-table-column>
          <el-table-column prop="title" label="名称">
            <template v-slot="scope">
              <el-link type="primary" @click="jump(`/problem-set/${scope.row.id}`)">
                {{ scope.row.title }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template v-slot="scope">
              <el-tag v-if="scope.row.status === 1" type="success">公开</el-tag>
              <el-tag v-else type="info">私有</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>


  </div>
</template>

<script>
import {pagePublicProblemSet, listMyProblemSet} from "@/api/problemSet";

export default {
  name: "ProblemSet",
  data() {
    return {
      activeName: "public",
      total: 0,
      problemSets: [],
      myProblemSets: [],
      queryForm: {
        page: 1,
        pageSize: 10,
        title: "",
      },
    };
  },
  mounted() {
    this.fetchProblemSet();
    this.fetchMyProblemSet();
  },
  methods: {
    jump(path) {
      this.$router.push(path);
    },
    async fetchMyProblemSet() {
      this.myProblemSets = await listMyProblemSet();
    },
    async fetchProblemSet() {
      const {page, pageSize, title} = this.queryForm;
      const data = await pagePublicProblemSet(page, pageSize, title);
      this.problemSets = data.records;
      this.total = data.total;
    },
    handleCurrentChange(val) {
      this.queryForm.page = val;
      this.fetchProblemSet();
    },
    sizeChange(pageSize) {
      this.queryForm.pageSize = pageSize;
      this.fetchProblemSet();
    },
  },
};
</script>

<style scoped>
.problem-set-container {
  padding: 20px;
}

.head {
  margin-bottom: 10px;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}
</style>
