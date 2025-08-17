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
        <el-row :gutter="20">
            <el-col :span="isLogin ? 8 : 24">
                <el-card class="user-card" v-if="userInfo.username">
                    <div class="user-info">
                        <div class="user-profile">
                            <div class="user-header">
                                <el-avatar :src="userInfo.avatarUrl" :size="64"></el-avatar>
                                <h2>{{ userInfo.username }}</h2>
                            </div>
                            <!-- <div class="user-rank">
                                <el-tag :type="getRankType(userInfo.rank)">{{ userInfo.rank }}</el-tag>
                                <span class="rating">Rating: {{ userInfo.rating }}</span>
                            </div> -->
                            <div class="user-stats">
                                <div class="stat-item">
                                    <span class="stat-label">已解决题目</span>
                                    <span class="stat-value">{{ userInfo.solvedCount || 0 }}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">提交次数</span>
                                    <span class="stat-value">{{ userInfo.submissionCount || 0 }}</span>
                                </div>
                                <!-- <div class="stat-item">
                                    <span class="stat-label">通过率</span>
                                    <span class="stat-value">{{ calculatePassRate }}%</span>
                                </div> -->
                            </div>
                        </div>
                    </div>
                </el-card>
                <el-card v-else class="login-card">
                    <div class="login-prompt">
                        <i class="el-icon-user"></i>
                        <h3>登录以开始你的编程之旅</h3>
                        <el-button type="primary" @click="$router.push('/login')">立即登录</el-button>
                        <p>还没有账号? <el-link type="primary" @click="$router.push('/register')">注册</el-link></p>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="16">
                <!-- 最近提交记录 -->
                <el-card class="recent-submissions" v-if="userInfo.username">
                    <div slot="header">
                        <span>最近提交</span>
                        <el-button style="float: right; padding: 3px 0" type="text"
                            @click="$router.push('/submissions')">
                            查看更多
                        </el-button>
                    </div>
                    <el-table :data="recentSubmissions" style="width: 100%">
                        <el-table-column prop="problemTitle" label="题目" width="250">
                            <template #default="scope">
                                <el-link @click="$router.push(`/problem/${scope.row.problemId}`)">
                                    {{ scope.row.problemTitle }}
                                </el-link>
                            </template>
                        </el-table-column>
                        <el-table-column prop="submitTime" label="提交时间" width="180">
                            <template #default="scope">
                                {{ new Date(scope.row.submitTime).toLocaleString('zh-CN') }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="language" label="语言" width="100"></el-table-column>
                        <el-table-column prop="status" label="状态" width="120">
                            <template #default="scope">
                                <el-tag :type="getResultType(scope.row.status)">
                                    {{ getResultText(scope.row.status) }}
                                </el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
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
                <el-table-column prop="event" label="竞赛名称" width="500">
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
                            scope.row.resource }}</el-link>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
import { getUpcomingContestsFromClist } from '@/api/contest';
export default {
    name: 'HomePage',
    created() {
        this.fetchUpcomingContests();
    },
    async mounted() {
        if (this.$store.state.userInfo.username) {
            await this.$store.dispatch('getUserInfo');
            this.fetchRecentSubmissions();
        }
    },
    data() {
        return {
            upcomingContests: [],
            chosenPlatforms: ['leetcode', 'codeforces', 'nowcoder', 'luogu', 'atcoder'],
            upcomingTableLoading: false
        }
    },
    computed: {
        userInfo() {
            return this.$store.state.userInfo;
        },
        isLogin() {
            return true; // TODO
        }
    },
    methods: {
        // 获取距离比赛开始的时间
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
        // 获取即将到来的比赛
        async fetchUpcomingContests() {
            if (this.chosenPlatforms.length === 0) {
                this.upcomingContests = [];
                return;
            }
            this.upcomingTableLoading = true
            const regex = this.chosenPlatforms.join('|')
            const { data } = await getUpcomingContestsFromClist(regex)
            this.upcomingContests = data
            this.upcomingTableLoading = false
        },
        getResultType(result) {
            const statusMap = {
                'AC': 'success',
                'WA': 'danger',
                'TLE': 'warning',
                'MLE': 'warning',
                'RE': 'danger',
                'CE': 'info',
                'PE': 'warning'
            }
            return statusMap[result] || 'info'
        },
        getResultText(result) {
            const statusTextMap = {
                'AC': '通过',
                'WA': '答案错误',
                'TLE': '超时',
                'MLE': '内存超限',
                'RE': '运行错误',
                'CE': '编译错误',
                'PE': '格式错误'
            }
            return statusTextMap[result] || '未知'
        },
        getRankType(rank) {
            const rankMap = {
                '王者': 'danger',
                '大师': 'warning',
                '钻石': 'success',
                '黄金': 'info',
                '白银': '',
                '青铜': ''
            }
            return rankMap[rank] || ''
        },
        getDifficultyType(difficulty) {
            const difficultyMap = {
                '简单': 'success',
                '中等': 'warning',
                '困难': 'danger'
            }
            return difficultyMap[difficulty] || 'info'
        },
        async fetchStats() {
            // TODO: 调用获取统计数据的API
            this.stats = {
                problemCount: 100,
                problemSetCount: 10,
                ongoingContests: 2,
                problemPassRate: 65,
                hotTags: ['动态规划', '贪心', '图论']
            }
        },
        async fetchRecentSubmissions() {
            // TODO: 调用获取最近提交记录的API
            this.recentSubmissions = [
                {
                    problemId: 1,
                    problemTitle: "A+B问题",
                    submitTime: new Date(),
                    status: "AC",
                    language: "C++"
                }
            ]
        },
        async fetchLeaderboard() {
            // TODO: 调用获取排行榜数据的API
            this.leaderboardData = [
                {
                    userId: 1,
                    username: "user1",
                    rating: 2000,
                    rank: "王者",
                    solved: 100
                }
            ]
        },
        async fetchHotProblems() {
            // TODO: 调用获取热门题目的API
            this.hotProblems = [
                {
                    id: 1,
                    title: "两数之和",
                    difficulty: "简单",
                    passRate: 75
                }
            ]
        },
        async fetchActivities() {
            // TODO: 调用获取最新动态的API
            this.activities = [
                {
                    time: "2023-06-20",
                    title: "周赛预告",
                    content: "第100场周赛将于本周日举行"
                }
            ]
        }
    }
}
</script>

<style scoped>
.home-container {
    padding-left: 100px;
    padding-right: 100px;
}

.welcome-card {
    margin-bottom: 20px;
}

.upcoming-contests {
    margin-top: 20px;
}

.welcome-header {
    text-align: center;
    margin-bottom: 30px;
}

.welcome-header h1 {
    color: #303133;
    margin-bottom: 10px;
}

.welcome-content .el-card {
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    height: 220px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.welcome-content .el-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.welcome-content i {
    font-size: 40px;
    color: #409EFF;
    margin: 10px 0;
}

.card-footer {
    margin-top: 15px;
    color: #909399;
    font-size: 14px;
}

.tags {
    margin-top: 10px;
    display: flex;
    gap: 5px;
    justify-content: center;
}

.user-card {
    height: 100%;
}

.user-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 15px;
}

.user-rank {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
}

.rating {
    color: #E6A23C;
    font-weight: bold;
}

.user-stats {
    display: flex;
    justify-content: space-around;
    margin: 20px 0;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-label {
    font-size: 14px;
    color: #909399;
}

.stat-value {
    font-size: 20px;
    color: #303133;
    font-weight: bold;
}

.solved-progress {
    margin-top: 20px;
}

.recent-submissions {
    height: 100%;
}

.leaderboard {
    margin-top: 20px;
}

.login-card {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-prompt {
    text-align: center;
}

.login-prompt i {
    font-size: 48px;
    color: #909399;
    margin-bottom: 20px;
}

.login-prompt h3 {
    margin-bottom: 20px;
    color: #606266;
}

.login-prompt p {
    margin-top: 15px;
    color: #909399;
}

.hot-problems {
    height: 100%;
}

.news-feed {
    margin-top: 20px;
}

.news-feed .el-timeline {
    padding: 20px;
}

.news-feed .el-card {
    margin-bottom: 10px;
}
</style>