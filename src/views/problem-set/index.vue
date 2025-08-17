<template>
    <div class="problem-set">
        <el-card class="problem-set-list">
            <el-table :data="problemSets" style="width: 100%">
                <el-table-column prop="id" label="ID" width="80"></el-table-column>
                <el-table-column prop="title" label="名称">
                    <template slot-scope="scope">
                        <el-link type="primary" @click="jump(`/problem-set/${scope.row.id}`)">{{ scope.row.title }}</el-link>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

    </div>
</template>

<script>
import { listPublicProblemSet } from "@/api/problemSet";

export default {
    name: "ProblemSet",
    mounted() {
        this.fetchProblemSet();
    },
    data() {
        return {
            total: 0,
            problemSets: [],
            queryForm: {
                page: 1,
                limit: 10,
                title: "",
            },
        };
    },
    methods: {
        jump(path) {
            this.$router.push(path);
        },
        async fetchProblemSet() {
            try {
                const {page, size, title} = this.queryForm;
                const data = await listPublicProblemSet(page, size, title);
                this.problemSets = data.records;
                this.total = data.total;
            } catch (error) {
                this.$message.error("获取题单失败");
                console.error(error);
            }
        },
    },
};
</script>

<style scoped>
</style>
