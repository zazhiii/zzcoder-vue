<template>
    <div class="contest-info">
        <el-card>
            <el-tabs type="card">
                <el-tab-pane label="比赛说明">
                    <h1>{{ contest.title }}</h1>
                    <p>描述: {{ contest.description }}</p>
                    <p>开始时间: {{ contest.startTime }}</p>
                    <p>结束时间: {{ contest.endTime }}</p>
                    <p>持续时间: {{ contest.duration }} 分钟</p>
                    <p>状态: {{ contest.status === 0 ? '未开始' : (contest.status === 1 ? '比赛中' : '已结束') }}</p>
                    <p>类型: {{ contest.type === 0 ? '公开' : '私有' }}</p>
                    <p>创建者: {{ contest.createUserName }}</p>
                    <p>注册人数: {{ contest.registerCount }}</p>
                </el-tab-pane>
                <el-tab-pane label="题目列表" v-if="contest.status != 0">
                    <el-table :data="contestProblems" style="width: 100%">
                        <el-table-column prop="displayId" label="题号" width="80"></el-table-column>
                        <el-table-column prop="title" label="标题">
                            <template slot-scope="scope">
                                <el-link type="primary" @click="jump(`/problem/${scope.row.problemId}`)">
                                    {{ scope.row.title }}
                                </el-link>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column prop="" label="通过率" width="100"></el-table-column> -->
                        <!-- <el-table-column prop="" label="我的状态" width="100"></el-table-column> -->
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="排行榜" v-if="contest.status != 0">
                    <h1>排行榜</h1>
                </el-tab-pane>
                <el-tab-pane label="讨论区" v-if="contest.status != 0">
                    <h1>讨论区</h1>
                </el-tab-pane>
                <el-tab-pane label="提交记录" v-if="contest.status != 0">
                    <h1>提交记录</h1>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
import { getContestInfo } from '@/api/contest'
import { getContestProblems } from '@/api/contest'
import { Message } from 'element-ui';

export default {
    mounted() {
        this.fetchContestInfo()
    },
    data() {
        return {
            contest: {},
            contestProblems: []
        };
    },
    methods: {
        async fetchContestInfo() {
            try {
                const { data } = await getContestInfo(this.$route.params.id)
                this.contest = data
            } catch (error) {
                console.error('获取比赛信息失败', error)
            }

            if (this.contest.status !== 0) {
                this.fetchContestProblem(this.$route.params.id)
            }
        },
        async fetchContestProblem(contestId) {
            try {
                const { data } = await getContestProblems(contestId)
                this.contestProblems = data
            } catch (error) {
                Message.error('获取比赛题目失败')
                console.error('获取比赛题目失败', error)
            }
        },
        jump(path) {
            this.$router.push(path)
        }
    }
};
</script>

<style scoped>
.contest-info {
    /* padding: 20px; */
    background-color: #f9f9f9;
    border-radius: 5px;
}
</style>
