<template>
  <span class="difficulty-tag" :class="[
    `difficulty-${difficulty}`,
    size,
    {
      'clickable': clickable,
      'with-icon': showIcon,
      'rounded': rounded
    }
  ]" @click="handleClick" :title="tooltip || `难度: ${getDifficultyLabel(difficulty)}`">
    <i :class="getDifficultyIcon(difficulty)" v-if="showIcon"></i>
    <span class="difficulty-text">{{ getDifficultyLabel(difficulty) }}</span>
    <span class="difficulty-level" v-if="showLevel">({{ difficulty }})</span>
  </span>
</template>

<script>
export default {
  name: 'DifficultyTag',
  props: {
    // 难度等级 (0-6)
    difficulty: {
      type: Number,
      required: true,
      validator: (value) => {
        return value >= 0 && value <= 6;
      }
    },
    // 组件尺寸
    size: {
      type: String,
      default: 'medium',
      validator: (value) => {
        return ['large', 'medium', 'small', 'mini'].includes(value);
      }
    },
    // 是否可点击
    clickable: {
      type: Boolean,
      default: false
    },
    // 是否显示图标
    showIcon: {
      type: Boolean,
      default: false
    },
    // 是否显示难度数字
    showLevel: {
      type: Boolean,
      default: false
    },
    // 是否圆角样式
    rounded: {
      type: Boolean,
      default: false
    },
    // 自定义提示文本
    tooltip: {
      type: String,
      default: ''
    },
    // 主题风格
    theme: {
      type: String,
      default: 'default',
      validator: (value) => {
        return ['default', 'gradient', 'outline', 'minimal'].includes(value);
      }
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
      return map[difficulty] || '未知';
    },
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
    handleClick() {
      if (!this.clickable) return;

      this.$emit('click', {
        difficulty: this.difficulty,
        label: this.getDifficultyLabel(this.difficulty),
        type: this.getDifficultyType(this.difficulty)
      });
    }
  }
}
</script>

<style scoped>
.difficulty-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  border-radius: 4px;
  transition: all 0.3s ease;
  user-select: none;
  white-space: nowrap;
  border: 1px solid transparent;
}

/* 尺寸样式 */
.difficulty-tag.mini {
  font-size: 10px;
  padding: 1px 4px;
  gap: 2px;
}

.difficulty-tag.small {
  font-size: 11px;
  padding: 2px 6px;
  gap: 3px;
}

.difficulty-tag.medium {
  font-size: 12px;
  padding: 4px 8px;
  gap: 4px;
}

.difficulty-tag.large {
  font-size: 14px;
  padding: 6px 12px;
  gap: 5px;
}

/* 圆角样式 */
.difficulty-tag.rounded {
  border-radius: 12px;
}

.difficulty-tag.rounded.mini {
  border-radius: 8px;
}

.difficulty-tag.rounded.large {
  border-radius: 16px;
}

/* 可点击样式 */
.difficulty-tag.clickable {
  cursor: pointer;
}

.difficulty-tag.clickable:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 图标样式 */
.difficulty-tag.with-icon i {
  font-size: 1em;
}

.difficulty-level {
  opacity: 0.8;
  font-size: 0.9em;
  margin-left: 2px;
}

/* 难度等级颜色 */
.difficulty-tag.difficulty-0 {
  background: linear-gradient(135deg, #67C23A 0%, #85CE61 100%);
  color: white;
}

.difficulty-tag.difficulty-1 {
  background: linear-gradient(135deg, #85CE61 0%, #95D475 100%);
  color: white;
}

.difficulty-tag.difficulty-2 {
  background: linear-gradient(135deg, #E6A23C 0%, #EBB563 100%);
  color: white;
}

.difficulty-tag.difficulty-3 {
  background: linear-gradient(135deg, #E6A23C 0%, #F1C232 100%);
  color: white;
}

.difficulty-tag.difficulty-4 {
  background: linear-gradient(135deg, #F56C6C 0%, #F78989 100%);
  color: white;
}

.difficulty-tag.difficulty-5 {
  background: linear-gradient(135deg, #F56C6C 0%, #FF4757 100%);
  color: white;
}

.difficulty-tag.difficulty-6 {
  background: linear-gradient(135deg, #FF4757 0%, #FF3742 100%);
  color: white;
}

/* Hover 效果 */
.difficulty-tag.difficulty-0:hover {
  background: linear-gradient(135deg, #85CE61 0%, #95D475 100%);
}

.difficulty-tag.difficulty-1:hover {
  background: linear-gradient(135deg, #95D475 0%, #A5E485 100%);
}

.difficulty-tag.difficulty-2:hover {
  background: linear-gradient(135deg, #EBB563 0%, #F0C573 100%);
}

.difficulty-tag.difficulty-3:hover {
  background: linear-gradient(135deg, #F1C232 0%, #F5D142 100%);
}

.difficulty-tag.difficulty-4:hover {
  background: linear-gradient(135deg, #F78989 0%, #FA9999 100%);
}

.difficulty-tag.difficulty-5:hover {
  background: linear-gradient(135deg, #FF4757 0%, #FF5767 100%);
}

.difficulty-tag.difficulty-6:hover {
  background: linear-gradient(135deg, #FF3742 0%, #FF4752 100%);
}

/* 主题样式 */
.difficulty-tag.theme-outline {
  background: transparent;
  border-width: 1px;
  border-style: solid;
}

.difficulty-tag.theme-outline.difficulty-0 {
  border-color: #67C23A;
  color: #67C23A;
}

.difficulty-tag.theme-outline.difficulty-1 {
  border-color: #85CE61;
  color: #85CE61;
}

.difficulty-tag.theme-outline.difficulty-2 {
  border-color: #E6A23C;
  color: #E6A23C;
}

.difficulty-tag.theme-outline.difficulty-3 {
  border-color: #E6A23C;
  color: #E6A23C;
}

.difficulty-tag.theme-outline.difficulty-4 {
  border-color: #F56C6C;
  color: #F56C6C;
}

.difficulty-tag.theme-outline.difficulty-5 {
  border-color: #F56C6C;
  color: #F56C6C;
}

.difficulty-tag.theme-outline.difficulty-6 {
  border-color: #FF4757;
  color: #FF4757;
}

.difficulty-tag.theme-minimal {
  background: rgba(0, 0, 0, 0.05);
  color: #606266;
  border: none;
}

.difficulty-tag.theme-minimal:hover {
  background: rgba(0, 0, 0, 0.1);
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .difficulty-tag {
    box-shadow: 0 1px 3px rgba(255, 255, 255, 0.1);
  }

  .difficulty-tag.clickable:hover {
    box-shadow: 0 2px 8px rgba(255, 255, 255, 0.2);
  }

  .difficulty-tag.theme-minimal {
    background: rgba(255, 255, 255, 0.1);
    color: #E4E7ED;
  }

  .difficulty-tag.theme-minimal:hover {
    background: rgba(255, 255, 255, 0.15);
  }
}

/* 动画效果 */
@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

.difficulty-tag.clickable:active {
  animation: pulse 0.2s ease-in-out;
}

/* 禁用状态 */
.difficulty-tag.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
