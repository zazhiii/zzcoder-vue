<script>
export default {
  props: {
    value: {
      type: [Number, String],
      required: true,
    },
    size: {
      type: String,
      default: 'medium'
    }
  },
  data() {
    return {
      difficultyOptions: [
        {value: 0, label: '入门'},
        {value: 1, label: '简单'},
        {value: 2, label: '简单+'},
        {value: 3, label: '中等'},
        {value: 4, label: '中等+'},
        {value: 5, label: '困难'},
        {value: 6, label: '困难+'}]
    }
  },
  methods: {
    handleChange(value) {
      this.$emit('input', value);
    }
  }
}
</script>

<template>
  <div>
    <el-select :value="value" @input="handleChange" placeholder="选择难度" clearable :size="size">
      <el-option v-for="item in difficultyOptions"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<style scoped>

</style>