<template>
    <div>
        <el-card>
            <el-menu router mode="horizontal">
                <el-menu-item index="/user/profile">
                    <span>个人信息</span>
                </el-menu-item>
                <el-menu-item index="/user/submissions">
                    <span>提交记录</span>
                </el-menu-item>
                <el-menu-item index="/user/settings">
                    <span>设置</span>
                </el-menu-item>
            </el-menu>
            <div>
                <router-view />
            </div>
        </el-card>
    </div>

</template>

<script>
// import { getToken } from '@/utils/auth';

export default {
    name: 'UserProfilePage',
    computed: {
        // userInfo() {
        //     console.log(this.$store.state.userInfo);
        //     return this.$store.state.userInfo;
        // }
    },
    data() {
        return {
            // token: getToken(),
        };
    },
    methods: {

    }
}
</script>