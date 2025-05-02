<template>
    <div class="home-container">
        <!-- 欢迎卡片 -->
        <el-card class="welcome-card">
            <div class="welcome-header">
                <h1>欢迎来到zzcoder</h1>
                <p>这里是一个供编程爱好者学习、练习和竞赛的平台</p>
            </div>
            <div class="welcome-content">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-card shadow="hover" @click.native="$router.push('/problem')">
                            <i class="el-icon-collection"></i>
                            <h3>题库</h3>
                            <p>海量编程题目等你来挑战</p>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" @click.native="$router.push('/problem-set')">
                            <i class="el-icon-notebook-2"></i>
                            <h3>题单</h3>
                            <p>精心编排的题目集合助你进步</p>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" @click.native="$router.push('/contest')">
                            <i class="el-icon-trophy"></i>
                            <h3>竞赛</h3>
                            <p>参加比赛提升实战能力</p>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </el-card>

        <!-- 用户信息卡片 -->
        <el-card class="user-card" v-if="userInfo.username">
            <div class="user-info">
                <h2>欢迎回来, {{userInfo.username}}</h2>
                <el-avatar :src="userInfo.avatarUrl" :size="64"></el-avatar>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'HomePage',
    async mounted() {
        if(this.$store.state.userInfo.username) {
            await this.$store.dispatch('getUserInfo');
        }
    },
    data() {
        return {
        }
    },
    computed: {
        userInfo() {
            return this.$store.state.userInfo;
        }
    },
    methods: {
    }
}
</script>

<style scoped>

.welcome-card {
    margin-bottom: 20px;
}

.welcome-header {
    text-align: center;
    margin-bottom: 30px;
}

.welcome-content .el-card {
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
}

.welcome-content .el-card:hover {
    transform: translateY(-5px);
}

.welcome-content i {
    font-size: 40px;
    color: #409EFF;
    margin: 10px 0;
}

.user-card {
    margin-top: 20px;
}

.user-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
}
</style>