<template>
    <div>
        <el-card>
            <el-tabs type="card">
                <el-tab-pane label="个人信息">
                    <Profile />
                </el-tab-pane>
                <el-tab-pane label="提交记录">
                    <Submissions :submissionQuery="{
                        username: userInfo.username,
                    }" />
                </el-tab-pane>
                <el-tab-pane label="设置">
                    <Settings />
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>

</template>

<script>
import { mapState } from 'vuex';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Submissions from '@/views/judge/components/Submissions';

export default {
    name: 'UserProfilePage',
    components: {
        Profile,
        Submissions,
        Settings
    },
    computed: {
        ...mapState('user', ['userInfo'])
    },
}
</script>