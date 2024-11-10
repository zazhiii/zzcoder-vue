<template>
    <el-tag :type="getDifficultyType(difficulty)">
        {{ getDifficultyLabel(difficulty) }}
    </el-tag>
</template>

<script>
export default {
    name: 'DifficultyTag',
    props: {
        difficulty: {
            type: Number,
            required: true
        }
    },
    methods: {
        getDifficultyType(difficulty) {
            switch (difficulty) {
                case 0:
                    return 'success';
                case 1:
                    return 'warning';
                case 2:
                    return 'warning';
                case 3: 
                    return 'danger';
                case 4:
                    return 'danger';
                case 5:
                    return 'danger';
                case 6:
                    return 'danger';
                default:
                    return 'info';
            }
        },
        getDifficultyLabel(difficulty) {
            switch (difficulty) {
                case 0:
                    return '入门';
                case 1:
                    return '简单';
                case 2:
                    return '简单+';
                case 3:
                    return '中等';
                case 4:
                    return '中等+';
                case 5:
                    return '困难';
                case 6:
                    return '困难+';
                default:
                    return '未知';
            }
        }
    }
}
</script>
