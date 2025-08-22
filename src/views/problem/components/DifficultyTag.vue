<template>
  <el-tag :type="getDifficultyType(difficulty)" :size="size">
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
    },
    size: {
      type: String,
      default: 'default' // 'medium', 'small', 'mini'
    }
  },
  methods: {
    getDifficultyType(difficulty) {
      const map = {
        0: 'success',
        1: 'success',
        2: 'warning',
        3: 'warning',
        4: 'danger',
        5: 'danger',
        6: 'danger'
      }
      return map[difficulty] || 'info';
    },
    getDifficultyLabel(difficulty) {
      const map = {
        0: '入门',
        1: '简单',
        2: '简单+',
        3: '中等',
        4: '中等+',
        5: '困难',
        6: '困难+'
      }
      return map[difficulty] || 'info';
    }
  }
}
</script>
