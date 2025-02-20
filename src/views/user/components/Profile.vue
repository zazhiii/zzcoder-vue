<template>
    <div class="profile-container">
        <el-card>
            <div class="user-info">
                <el-avatar :size="100" :src="userInfo.avatarUrl"></el-avatar>
                <div class="info-text">
                    <h2>{{ userInfo.username }}</h2>
                </div>
            </div>
            
            <el-divider></el-divider>
            
            <div class="statistics">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-card shadow="hover">
                            <div slot="header">解题统计</div>
                            <div class="stat-number">0</div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover">
                            <div slot="header">提交次数</div>
                            <div class="stat-number">0</div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover">
                            <div slot="header">通过率</div>
                            <div class="stat-number">0%</div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'UserProfileComponent',
    computed: {
        userInfo() {
            return this.$store.state.userInfo;
        }
    },
    data() {
        return {
            username: this.$store.state.username,
            avatarUrl: this.$store.state.avatarUrl,
        }
    }
}
</script>

<style scoped>
.profile-container {
    padding: 20px;
}

.user-info {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.info-text {
    margin-left: 20px;
}

.info-text h2 {
    margin: 0;
    margin-bottom: 10px;
}

.info-text p {
    margin: 0;
    color: #666;
}

.statistics {
    margin-top: 20px;
}

.stat-number {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    color: #409EFF;
}
</style>
