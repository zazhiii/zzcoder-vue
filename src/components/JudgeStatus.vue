<template>
    <div class="judge-status">
        <el-tag :type="typesMap[status] || 'info'">
            {{ statusMap[status] || '未知状态' }}
        </el-tag>
    </div>
</template>

<script>
export default {
    name: 'JudgeStatus',
    props: {
        status: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            statusMap: {
                'PENDING': '等待中',
                'JUDGING': '评测中',
                'AC': '答案正确',
                'WA': '错误答案',
                'TLE': '超出时间限制',
                'MLE': '超出内存限制',
                'RE': '运行错误',
                'CE': '编译错误',
                'SE': '系统错误'
            },
            typesMap:{
                'PENDING': 'info',
                'JUDGING': 'info',
                'AC': 'success',
                'WA': 'danger',
                'TLE': 'warning',
                'MLE': 'warning',
                'RE': 'danger',
                'CE': 'danger',
                'SE': 'danger'
            }
        }
    }
}
</script>