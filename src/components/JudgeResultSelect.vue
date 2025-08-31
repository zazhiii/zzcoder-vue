<!--
  判题结果选择组件
  
  使用示例：
  <JudgeResultSelect 
    v-model="selectedResult"
    placeholder="选择判题结果"
    :include-system-status="true"
    size="small"
    width="200px"
  />
  
  Props:
  - value: 选中的值
  - placeholder: 占位符文本
  - clearable: 是否可清空
  - disabled: 是否禁用
  - size: 尺寸 (large/medium/small/mini)
  - width: 宽度
  - includeSystemStatus: 是否包含系统状态(JUDGING, PENDING, SE)
  
  Events:
  - input: 值改变时触发
  - change: 值改变时触发
-->
<template>
    <el-select :value="value" @input="handleChange" :placeholder="placeholder" :clearable="clearable"
        :disabled="disabled" :size="size" :style="{ width: width }" class="judge-result-select">
        <el-option v-for="option in judgeResults" :key="option.value" :label="option.label" :value="option.value">
            <span class="result-option-item">
                <el-tag :type="option.type" size="mini" effect="dark" class="result-tag">
                    {{ option.value }}
                </el-tag>
                <span class="result-label">{{ option.label }}</span>
            </span>
        </el-option>
    </el-select>
</template>

<script>
import { getBasicJudgeResults, getAllJudgeResults, getResultType, getResultText } from '@/utils/judgeResult'

export default {
    name: 'JudgeResultSelect',
    props: {
        value: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: '选择判题结果'
        },
        clearable: {
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: 'small'
        },
        width: {
            type: String,
            default: '100%'
        },
        // 是否包含所有结果类型（包括系统状态）
        includeSystemStatus: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        judgeResults() {
            return this.includeSystemStatus ? getAllJudgeResults() : getBasicJudgeResults();
        }
    },
    methods: {
        handleChange(value) {
            this.$emit('input', value);
            this.$emit('change', value);
        },

        // 获取结果类型（外部可调用）
        getResultType,

        // 获取结果文本（外部可调用）
        getResultText
    }
}
</script>

<style scoped>
.judge-result-select {
    width: 100%;
}

.result-option-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
}

.result-tag {
    font-weight: 500;
    min-width: 35px;
    text-align: center;
    font-size: 0.75rem;
}

.result-label {
    flex: 1;
    font-size: 0.9rem;
}

/* 选择器下拉面板样式优化 */
.judge-result-select>>>.el-select-dropdown__item {
    padding: 8px 12px;
    transition: all 0.3s ease;
}

.judge-result-select>>>.el-select-dropdown__item:hover {
    background-color: #f8f9ff;
}

.judge-result-select>>>.el-select-dropdown__item.selected {
    background-color: #e8f4fd;
    color: #409EFF;
    font-weight: 500;
}

.judge-result-select>>>.el-select-dropdown__item.selected .result-label {
    color: #409EFF;
}
</style>
