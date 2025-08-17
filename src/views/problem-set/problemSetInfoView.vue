<template>
    <div class="problem-info">
        <el-card>
            <h2>标题: {{ title }}</h2>
            <span>描述: {{ description }}</span> <br>
            <span>创建人: {{ createUser }}</span> <br>
            <span>创建时间: {{ createTime }}</span> <br>
            <problemList :problems="problems" :show-tags="true"/>            
        </el-card>
    </div>
</template>

<script>
import { getProblemSet } from '@/api/problemSet';
import problemList from '../problem/components/problemList.vue';

export default {
    name: 'ProblemSetInfoView',
    components: {
        problemList,
    },
    data() {
        return {
            title: '',
            description: '',
            createUser: '',
            createTime: '',
            problems: [],
        };
    },
    async mounted() {
        await this.fetchProblemSet();
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
