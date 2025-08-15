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
    </div>
</template>

<script>
import { getContestList } from '@/api/contest'

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
            contests: []
        }
    },
    computed: {
        userInfo() {
            return this.$store.state.userInfo;
        }
    },
    created() {
        this.fetchContests(this.pageQueryDTO)
    },
    methods: {
        async fetchContests(pageQueryDTO) {
            try {
                const { data } = await getContestList(pageQueryDTO)
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
