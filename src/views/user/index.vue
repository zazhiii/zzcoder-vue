<template>
    <div>
        <el-card>
            <el-menu router mode="horizontal">
                <el-menu-item index="/user/profile">
                    <span>个人信息</span>
                </el-menu-item>
                <el-menu-item index="/user/settings">
                    <span>设置</span>
                </el-menu-item>
            </el-menu>
            <div>
                <router-view />
            </div>
        </el-card>
        <!-- 
        <el-tabs type="border-card">
            <el-tab-pane :label="userInfo.username">
                <Profile />
            </el-tab-pane>
            <el-tab-pane label="设置">
                <el-tabs type="card">
                    <el-tab-pane label="基本设置">
                        <GeneralSetting />
                    </el-tab-pane>
                    <el-tab-pane label="修改头像">
                        <UpdateAvatar />
                    </el-tab-pane>
                    <el-tab-pane label="修改密码">
                        <UpdatePassword />
                    </el-tab-pane>
                    <el-tab-pane label="修改邮箱地址">
                        <UpdateEmail />
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
        </el-tabs> -->
    </div>

</template>

<script>
import { getToken } from '@/utils/auth';
// import GeneralSetting from './components/GeneralSetting.vue';
// import UpdateAvatar from './components/UpdateAvater.vue';
// import UpdatePassword from './components/UpdatePassword.vue';
// import UpdateEmail from './components/UpdateEmail.vue';
// import Profile from './components/Profile.vue';

export default {
    name: 'UserProfilePage',
    computed: {
        userInfo() {
            console.log(this.$store.state.userInfo);
            return this.$store.state.userInfo;
        }
    },
    components: {
        // GeneralSetting,
        // UpdateAvatar,
        // UpdatePassword,
        // UpdateEmail,
        // Profile
    },
    data() {
        return {
            token: getToken(),
        };
    },
    methods: {

    }
}
</script>