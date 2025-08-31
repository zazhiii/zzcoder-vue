<script>
export default {
  name: 'DifficultySelect',
  props: {
    // v-model 绑定值
    value: {
      type: [Number, Array],
    },
    // 占位符文本
    placeholder: {
      type: String,
      default: '请选择难度'
    },
    // 组件尺寸
    size: {
      type: String,
      default: 'medium',
      validator: (value) => {
        return ['large', 'medium', 'small', 'mini'].includes(value);
      }
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否可清空
    clearable: {
      type: Boolean,
      default: true
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 是否可搜索
    filterable: {
      type: Boolean,
      default: false
    },
    // 是否显示图标
    showIcon: {
      type: Boolean,
      default: true
    },
    // 是否显示难度数字
    showLevel: {
      type: Boolean,
      default: false
    },
    // 是否显示难度徽章
    showBadge: {
      type: Boolean,
      default: false
    },
    // 可选难度列表（如果为空则显示所有难度）
    difficulties: {
      type: Array,
      default: () => []
    },
    // 排除的难度列表
    excludeDifficulties: {
      type: Array,
      default: () => []
    },
    // 最小难度
    minDifficulty: {
      type: Number,
      default: 0,
      validator: (value) => value >= 0 && value <= 6
    },
    // 最大难度
    maxDifficulty: {
      type: Number,
      default: 6,
      validator: (value) => value >= 0 && value <= 6
    }
  },
  data() {
    return {
      selectedDifficulty: this.value,
      // 所有难度配置
      allDifficulties: [
        { value: 0, label: '入门', disabled: false },
        { value: 1, label: '简单', disabled: false },
        { value: 2, label: '简单+', disabled: false },
        { value: 3, label: '中等', disabled: false },
        { value: 4, label: '中等+', disabled: false },
        { value: 5, label: '困难', disabled: false },
        { value: 6, label: '困难+', disabled: false }
      ]
    }
  },
  computed: {
    // 可用的难度选项
    availableDifficulties() {
      let difficulties = this.allDifficulties;

      // 根据最小最大难度过滤
      difficulties = difficulties.filter(diff =>
        diff.value >= this.minDifficulty && diff.value <= this.maxDifficulty
      );

      // 如果指定了difficulties，只显示指定的难度
      if (this.difficulties && this.difficulties.length > 0) {
        difficulties = difficulties.filter(diff =>
          this.difficulties.includes(diff.value)
        );
      }

      // 排除指定的难度
      if (this.excludeDifficulties && this.excludeDifficulties.length > 0) {
        difficulties = difficulties.filter(diff =>
          !this.excludeDifficulties.includes(diff.value)
        );
      }

      return difficulties;
    }
  },
  watch: {
    value(newVal) {
      this.selectedDifficulty = newVal;
    },
    selectedDifficulty(newVal) {
      this.$emit('input', newVal);
    }
  },
  methods: {
    getDifficultyIcon(difficulty) {
      const iconMap = {
        0: 'el-icon-sunny',
        1: 'el-icon-partly-cloudy',
        2: 'el-icon-cloudy',
        3: 'el-icon-heavy-rain',
        4: 'el-icon-lightning',
        5: 'el-icon-thunder',
        6: 'el-icon-volcano'
      };
      return iconMap[difficulty] || 'el-icon-question';
    },
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
    getDifficultyColor(difficulty) {
      const colorMap = {
        0: '#67C23A',
        1: '#85CE61',
        2: '#E6A23C',
        3: '#F56C6C',
        4: '#F78989',
        5: '#F56C6C',
        6: '#FF4757'
      };
      return colorMap[difficulty] || '#909399';
    },
    handleChange(value) {
      this.selectedDifficulty = value;

      // 发送change事件，包含选中的难度信息
      const selectedInfo = this.multiple
        ? value.map(val => this.getDifficultyInfo(val))
        : this.getDifficultyInfo(value);

      this.$emit('change', value, selectedInfo);
    },
    handleClear() {
      this.selectedDifficulty = this.multiple ? [] : '';
      this.$emit('clear');
    },
    // 获取难度详细信息
    getDifficultyInfo(difficultyValue) {
      const difficulty = this.allDifficulties.find(diff => diff.value === difficultyValue);
      return {
        ...difficulty,
        type: this.getDifficultyType(difficultyValue),
        color: this.getDifficultyColor(difficultyValue),
        icon: this.getDifficultyIcon(difficultyValue)
      };
    },
    // 获取选中的难度信息（供外部调用）
    getSelectedDifficulties() {
      if (this.multiple) {
        return this.selectedDifficulty.map(val => this.getDifficultyInfo(val));
      } else if (this.selectedDifficulty !== '') {
        return this.getDifficultyInfo(this.selectedDifficulty);
      }
      return null;
    }
  }
}
</script>

<template>
  <el-select v-model="selectedDifficulty" :placeholder="placeholder" :size="size" :disabled="disabled"
    :clearable="clearable" :multiple="multiple" :filterable="filterable" @change="handleChange" @clear="handleClear"
    class="difficulty-select">
    <el-option v-for="difficulty in availableDifficulties" :key="difficulty.value" :label="difficulty.label"
      :value="difficulty.value" :disabled="difficulty.disabled">
      <div class="difficulty-option">
        <i :class="getDifficultyIcon(difficulty.value)" v-if="showIcon"></i>
        <span class="difficulty-name">{{ difficulty.label }}</span>
        <span class="difficulty-level" v-if="showLevel">({{ difficulty.value }})</span>
        <span class="difficulty-badge" :class="`difficulty-${difficulty.value}`" v-if="showBadge">
          {{ difficulty.label }}
        </span>
      </div>
    </el-option>
  </el-select>
</template>

<style scoped>
.difficulty-select {
  min-width: 120px;
}

.difficulty-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.difficulty-option i {
  font-size: 16px;
  width: 16px;
  text-align: center;
  color: #909399;
}

.difficulty-name {
  flex: 1;
  text-align: left;
}

.difficulty-level {
  opacity: 0.7;
  font-size: 12px;
  color: #909399;
}

.difficulty-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 500;
  color: white;
  min-width: 50px;
  justify-content: center;
}

/* 难度徽章样式（与DifficultyTag保持一致） */
.difficulty-badge.difficulty-0 {
  background: linear-gradient(135deg, #67C23A 0%, #85CE61 100%);
}

.difficulty-badge.difficulty-1 {
  background: linear-gradient(135deg, #85CE61 0%, #95D475 100%);
}

.difficulty-badge.difficulty-2 {
  background: linear-gradient(135deg, #E6A23C 0%, #EBB563 100%);
}

.difficulty-badge.difficulty-3 {
  background: linear-gradient(135deg, #E6A23C 0%, #F1C232 100%);
}

.difficulty-badge.difficulty-4 {
  background: linear-gradient(135deg, #F56C6C 0%, #F78989 100%);
}

.difficulty-badge.difficulty-5 {
  background: linear-gradient(135deg, #F56C6C 0%, #FF4757 100%);
}

.difficulty-badge.difficulty-6 {
  background: linear-gradient(135deg, #FF4757 0%, #FF3742 100%);
}

/* 图标颜色根据难度变化 */
.difficulty-option:has(.difficulty-badge.difficulty-0) i {
  color: #67C23A;
}

.difficulty-option:has(.difficulty-badge.difficulty-1) i {
  color: #85CE61;
}

.difficulty-option:has(.difficulty-badge.difficulty-2) i {
  color: #E6A23C;
}

.difficulty-option:has(.difficulty-badge.difficulty-3) i {
  color: #E6A23C;
}

.difficulty-option:has(.difficulty-badge.difficulty-4) i {
  color: #F56C6C;
}

.difficulty-option:has(.difficulty-badge.difficulty-5) i {
  color: #F56C6C;
}

.difficulty-option:has(.difficulty-badge.difficulty-6) i {
  color: #FF4757;
}

/* 悬停效果 */
.el-select-dropdown__item:hover .difficulty-badge {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

.el-select-dropdown__item:hover .difficulty-option i {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

/* 选中状态 */
.el-select-dropdown__item.selected .difficulty-option i {
  color: #409EFF;
}

.el-select-dropdown__item.selected .difficulty-badge {
  opacity: 0.9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 禁用状态 */
.el-select-dropdown__item.is-disabled .difficulty-option {
  opacity: 0.5;
}

.el-select-dropdown__item.is-disabled .difficulty-badge {
  filter: grayscale(1);
}

/* 多选模式样式 */
.difficulty-select.el-select--multiple .el-select__tags {
  max-height: 60px;
  overflow-y: auto;
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .difficulty-option i {
    color: #C0C4CC;
  }

  .difficulty-level {
    color: #C0C4CC;
  }

  .el-select-dropdown__item.selected .difficulty-option i {
    color: #79BBF2;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .difficulty-option {
    gap: 6px;
  }

  .difficulty-badge {
    padding: 1px 4px;
    font-size: 9px;
    min-width: 40px;
  }
}
</style>