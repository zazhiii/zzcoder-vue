<template>
    <div>
        <h1>基本设置</h1>
        <el-form :model="form" label-width="150px">
            <el-form-item label="codeforces用户名">
                <el-input v-model="form.cfUsername"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'GeneralSetting',
    data() {
        return {
            form: {
                cfUsername: '',
            }
        };
    },
    methods: {
        submitForm() {
            // 这里可以添加保存数据的逻辑
            console.log('保存成功');
        }
    }
};
</script>