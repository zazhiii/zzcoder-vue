<template>
    <div>
        <el-card>
            <h1>比赛列表</h1>
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
            contests: []
        }
    },
    created() {
        this.fetchContests()
    },
    methods: {
        async fetchContests() {
            try {
                const { data } = await getContestList()
                this.contests = data
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
