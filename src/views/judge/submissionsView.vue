<template>
    <el-card>
        <Submissions :submissionQuery="{}" />
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

        }
    }
}
</script>