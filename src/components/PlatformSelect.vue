<template>
    <el-select v-model="selectedPlatform" :placeholder="placeholder" :size="size" :disabled="disabled"
        :clearable="clearable" :multiple="multiple" :filterable="filterable" @change="handleChange" @clear="handleClear"
        class="platform-select">
        <el-option v-for="platform in availablePlatforms" :key="platform.value" :label="platform.label"
            :value="platform.value" :disabled="platform.disabled">
            <div class="platform-option">
                <i :class="platform.icon" v-if="showIcon"></i>
                <span class="platform-name">{{ platform.label }}</span>
                <span class="platform-badge" :class="platform.value.toLowerCase()" v-if="showBadge">
                    {{ platform.label }}
                </span>
            </div>
        </el-option>
    </el-select>
</template>

<script>
export default {
    name: 'PlatformSelect',
    props: {
        // v-model 绑定值
        value: {
            type: [String, Array],
            default: ''
        },
        // 占位符文本
        placeholder: {
            type: String,
            default: '请选择平台'
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
            default: true
        },
        // 是否显示图标
        showIcon: {
            type: Boolean,
            default: true
        },
        // 是否显示平台徽章
        showBadge: {
            type: Boolean,
            default: false
        },
        // 可选平台列表（如果为空则显示所有平台）
        platforms: {
            type: Array,
            default: () => []
        },
        // 排除的平台列表
        excludePlatforms: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            selectedPlatform: this.value,
            // 所有支持的平台配置
            allPlatforms: [
                {
                    value: 'zzcoder',
                    label: 'ZZCoder',
                    icon: 'el-icon-s-platform',
                    disabled: false
                },
                {
                    value: 'leetcode',
                    label: 'LeetCode',
                    icon: 'el-icon-cpu',
                    disabled: false
                },
                {
                    value: 'luogu',
                    label: '洛谷',
                    icon: 'el-icon-trophy',
                    disabled: false
                },
                {
                    value: 'codeforces',
                    label: 'Codeforces',
                    icon: 'el-icon-data-analysis',
                    disabled: false
                },
                {
                    value: 'atcoder',
                    label: 'AtCoder',
                    icon: 'el-icon-medal',
                    disabled: false
                },
                {
                    value: 'nowcoder',
                    label: '牛客',
                    icon: 'el-icon-school',
                    disabled: false
                },
                {
                    value: 'hdu',
                    label: 'HDU',
                    icon: 'el-icon-collection',
                    disabled: false
                },
                {
                    value: 'poj',
                    label: 'POJ',
                    icon: 'el-icon-notebook-1',
                    disabled: false
                }
            ]
        };
    },
    computed: {
        // 可用的平台选项
        availablePlatforms() {
            let platforms = this.allPlatforms;

            // 如果指定了platforms，只显示指定的平台
            if (this.platforms && this.platforms.length > 0) {
                platforms = platforms.filter(platform =>
                    this.platforms.includes(platform.value)
                );
            }

            // 排除指定的平台
            if (this.excludePlatforms && this.excludePlatforms.length > 0) {
                platforms = platforms.filter(platform =>
                    !this.excludePlatforms.includes(platform.value)
                );
            }

            return platforms;
        }
    },
    watch: {
        value(newVal) {
            this.selectedPlatform = newVal;
        },
        selectedPlatform(newVal) {
            this.$emit('input', newVal);
        }
    },
    methods: {
        handleChange(value) {
            this.selectedPlatform = value;

            // 发送change事件，包含选中的平台信息
            const selectedInfo = this.multiple
                ? value.map(val => this.getPlatformInfo(val))
                : this.getPlatformInfo(value);

            this.$emit('change', value, selectedInfo);
        },
        handleClear() {
            this.selectedPlatform = this.multiple ? [] : '';
            this.$emit('clear');
        },
        // 获取平台详细信息
        getPlatformInfo(platformValue) {
            return this.allPlatforms.find(platform => platform.value === platformValue);
        },
        // 获取平台URL（继承自PlatformTag的逻辑）
        getPlatformUrl(platformValue) {
            const urlMap = {
                'zzcoder': '/', // 本站首页
                'leetcode': 'https://leetcode.cn/',
                'luogu': 'https://www.luogu.com.cn/',
                'codeforces': 'https://codeforces.com/',
                'atcoder': 'https://atcoder.jp/',
                'nowcoder': 'https://www.nowcoder.com/',
                'hdu': 'https://acm.hdu.edu.cn/',
                'poj': 'http://poj.org/'
            };
            return urlMap[platformValue] || '#';
        },
        // 获取选中的平台信息（供外部调用）
        getSelectedPlatforms() {
            if (this.multiple) {
                return this.selectedPlatform.map(val => ({
                    ...this.getPlatformInfo(val),
                    url: this.getPlatformUrl(val)
                }));
            } else if (this.selectedPlatform) {
                return {
                    ...this.getPlatformInfo(this.selectedPlatform),
                    url: this.getPlatformUrl(this.selectedPlatform)
                };
            }
            return null;
        }
    }
}
</script>

<style scoped>
.platform-select {
    min-width: 120px;
}

.platform-option {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
}

.platform-option i {
    font-size: 16px;
    width: 16px;
    text-align: center;
}

.platform-name {
    flex: 1;
    text-align: left;
}

.platform-badge {
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

/* 平台徽章样式（与PlatformTag保持一致） */
.platform-badge.zzcoder {
    background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
}

.platform-badge.leetcode {
    background: linear-gradient(135deg, #FFA116 0%, #FF8C00 100%);
}

.platform-badge.luogu {
    background: linear-gradient(135deg, #0E90FF 0%, #1E90FF 100%);
}

.platform-badge.codeforces {
    background: linear-gradient(135deg, #FF4757 0%, #FF3742 100%);
}

.platform-badge.atcoder {
    background: linear-gradient(135deg, #3742FA 0%, #2F3BF0 100%);
}

.platform-badge.nowcoder {
    background: linear-gradient(135deg, #2ED573 0%, #1DD1A1 100%);
}

.platform-badge.hdu {
    background: linear-gradient(135deg, #5F27CD 0%, #4834D4 100%);
}

.platform-badge.poj {
    background: linear-gradient(135deg, #747D8C 0%, #57606F 100%);
}

/* 图标颜色 */
.platform-option i {
    color: #909399;
}

/* 悬停效果 */
.el-select-dropdown__item:hover .platform-badge {
    transform: scale(1.05);
    transition: transform 0.2s ease;
}

/* 选中状态 */
.el-select-dropdown__item.selected .platform-option i {
    color: #409EFF;
}

.el-select-dropdown__item.selected .platform-badge {
    opacity: 0.9;
}

/* 禁用状态 */
.el-select-dropdown__item.is-disabled .platform-option {
    opacity: 0.5;
}

.el-select-dropdown__item.is-disabled .platform-badge {
    filter: grayscale(1);
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
    .platform-option i {
        color: #C0C4CC;
    }

    .el-select-dropdown__item.selected .platform-option i {
        color: #79BBF2;
    }
}
</style>
