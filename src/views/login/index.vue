<template>
    <el-container class="login-container">
        <el-main class="login-main">
            <el-card class="login-card">
                <router-view />
            </el-card>
        </el-main>
    </el-container>
</template>

<script>
export default {
    name: 'LoginView',
};
</script>

<style scoped>
.login-container {
    height: 100vh;
    background-color: #f0f2f5;
}

.login-main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.login-card {
    width: 400px;
    padding: 20px;
}
</style>
