<template>
    <el-card>
        <Submissions :submissionQuery="{
            problemId: problemId
        }" />
    </el-card>
</template>

<script>
import Submissions from '@/views/judge/components/Submissions'

export default {
    name: 'SubmissionsView',
    components: {
        Submissions
    },
    data() {
        return {
            problemId: this.$route.params.problemId
        }
    }

}
</script>