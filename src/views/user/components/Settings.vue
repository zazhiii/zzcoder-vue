<template>
    <el-card>
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
    </el-card>
</template>

<script>
import GeneralSetting from './settings/GeneralSetting.vue';
import UpdateAvatar from './settings/UpdateAvater.vue';
import UpdatePassword from './settings/UpdatePassword.vue';
import UpdateEmail from './settings/UpdateEmail.vue';


export default {
    name: 'UserSetting',
    components: {
        GeneralSetting,
        UpdateAvatar,
        UpdatePassword,
        UpdateEmail,
    },
}
</script>