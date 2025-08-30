<template>
  <div>
    <el-card>
      <div style="display: flex; align-items: center; margin-bottom: 20px">
        <h1 style="margin: 0; margin-right: 20px">比赛列表</h1>
        <el-button v-if="userInfo.permissions.includes('contest:create')" type="primary"
                   @click="jump('/contest/create')">创建比赛</el-button>
      </div>
      <el-table :data="contests" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="title" label="名称">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="jump(`/contest/${scope.row.id}`)">{{
                scope.row.title }}</el-link>
          </template>
        </el-table-column>
        <!-- TODO：倒计时 -->
        <el-table-column prop="startTime" label="开始时间" width="200"></el-table-column>
        <el-table-column prop="duration" label="持续时间 " width="200"></el-table-column>
        <el-table-column prop="createUserName" label="创建者" width="200"></el-table-column>
        <el-table-column prop="registerCount" label="报名人数 " width="200"></el-table-column>
        <el-table-column prop="status" label="状态" width="200">
          <template slot-scope="scope">
            {{ scope.row.status === 0 ? '未开始' : (scope.row.status === 1 ? '比赛中' : '已结束') }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 近期比赛 -->
    <el-card class="upcoming-contests">
      <h3>即将到来的比赛</h3>
      <el-checkbox-group v-model="chosenPlatforms" @change="fetchUpcomingContests">
        <el-checkbox label="leetcode"></el-checkbox>
        <el-checkbox label="codeforces"></el-checkbox>
        <el-checkbox label="nowcoder"></el-checkbox>
        <el-checkbox label="luogu"></el-checkbox>
        <el-checkbox label="atcoder"></el-checkbox>
      </el-checkbox-group>
      <el-table :data="upcomingContests" v-loading="upcomingTableLoading">
        <el-table-column prop="event" label="竞赛名称" width="450">
          <template #default="scope">
            <el-link :href="scope.row.href" target="_blank" type="primary">{{ scope.row.event }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="start" label="开始时间" width="180">
          <template #default="scope">
            {{ new Date(scope.row.start + 'Z').toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="end" label="结束时间" width="180">
          <template #default="scope">
            {{ new Date(scope.row.end + 'Z').toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="持续时间" width="150">
          <template #default="scope">
            {{ Math.floor(scope.row.duration / 60) }} 分钟
          </template>
        </el-table-column>
        <el-table-column label="距离比赛开始" width="150">
          <template #default="scope">
            <el-tag v-if="new Date(scope.row.start) > new Date()">
              {{ getRemainingTime(scope.row.start) }}
            </el-tag>
            <el-tag v-else-if="new Date(scope.row.end) < new Date()" type="info">
              已结束
            </el-tag>
            <el-tag v-else type="success">
              进行中
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="resource" label="来源" width="200">
          <template #default="scope">
            <!-- target="_blank": 在新标签页中打开 -->
            <el-link :href="`https://${scope.row.resource}`" target="_blank" type="success">{{
                scope.row.resource
              }}
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {getContestList, getUpcomingContestsFromClist} from '@/api/contest'
import {mapState} from "vuex";

export default {
  name: 'ContestList',
  data() {
    return {
      pageQueryDTO: {
        pageNum: 1,
        pageSize: 10,
        keyword: '',
        contestStatus: '',
        type: ''
      },
      total: 0,
      contests: [],
      // clist 相关
      upcomingContests: [],
      chosenPlatforms: ['leetcode', 'codeforces', 'nowcoder', 'luogu', 'atcoder'],
      upcomingTableLoading: false,
    }
  },
  computed: {
    ...mapState('user', ['userInfo']),
  },
  created() {
    this.fetchContests(this.pageQueryDTO)
    this.fetchUpcomingContests();
  },
  methods: {
    // 获取即将到来的比赛
    async fetchUpcomingContests() {
      if (this.chosenPlatforms.length === 0) {
        this.upcomingContests = [];
        return;
      }
      this.upcomingTableLoading = true
      const regex = this.chosenPlatforms.join('|')
      this.upcomingContests = await getUpcomingContestsFromClist(regex)
      this.upcomingTableLoading = false
    },
    getRemainingTime(startTime) {
      const now = new Date();
      const start = new Date(new Date(startTime + 'Z').toLocaleString())
      const diff = start - now;
      if (diff > 24 * 60 * 60 * 1000) {
        const day = Math.floor(diff / 1000 / 60 / 60 / 24);
        const hour = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        return day + " 天 " + hour + " 小时";
      }
      if (diff > 60 * 60 * 1000) {
        const hour = Math.floor(diff / 1000 / 60 / 60);
        return hour + " 小时";
      }
      if (diff > 60 * 1000) {
        const minute = Math.floor(diff / 1000 / 60);
        return minute + " 分钟";
      }
      return Math.floor(diff / 1000) + " 秒";
    },
    async fetchContests(pageQueryDTO) {
      try {
        const data = await getContestList(pageQueryDTO)
        this.contests = data.records
        this.total = data.total
      } catch (error) {
        console.error('获取比赛列表失败', error)
      }
    },
    jump(path) {
      this.$router.push(path)
    }
  }
}
</script>
