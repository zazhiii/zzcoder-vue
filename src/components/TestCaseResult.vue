<template>
    <div class="test-case" :class="statusClass">
        <div class="test-case-header">
            <div class="test-case-id"># {{ index }}</div>
            <div class="status-icon">{{ statusIcon }}</div>
        </div>

        <div class="test-case-status">{{ statusText }}</div>

        <!-- 只有 AC 才展示时间和内存 -->
        <template v-if="item.status === 'AC'">
            <div class="test-case-metrics">
                <div class="test-case-time">
                    <span class="metric-label">时间:</span>
                    <span class="metric-value">{{ item.timeUsed }} ms</span>
                </div>
                <div class="test-case-memory">
                    <span class="metric-label">内存:</span>
                    <span class="metric-value">{{ memoryInMB }} MB</span>
                </div>
            </div>
        </template>

        <!-- 其他状态显示简单说明 -->
        <template v-else-if="showDescription">
            <div class="status-description">{{ statusDescription }}</div>
        </template>
    </div>
</template>

<script>
export default {
    name: "TestCaseResult",
    props: {
        index: {
            type: Number,
            required: true
        },
        item: {
            type: Object,
            required: true
        }
    },
    computed: {
        statusClass() {
            switch (this.item.status) {
                case "PENDING":
                    return "status-pending";
                case "JUDGING":
                    return "status-judging";
                case "AC":
                    return "status-ac";
                case "WA":
                    return "status-wa";
                case "TLE":
                    return "status-tle";
                case "MLE":
                    return "status-mle";
                case "RE":
                    return "status-re";
                case "CE":
                    return "status-ce";
                case "SE":
                    return "status-se";
                default:
                    return "status-unknown";
            }
        },
        statusText() {
            const statusMap = {
                "PENDING": "等待中",
                "JUDGING": "评测中",
                "AC": "答案正确",
                "WA": "错误答案",
                "TLE": "时间超限",
                "MLE": "内存超限",
                "RE": "运行错误",
                "CE": "编译错误",
                "SE": "系统错误"
            };
            return statusMap[this.item.status] || "未知状态";
        },
        statusIcon() {
            const iconMap = {
                "PENDING": "⏳",
                "JUDGING": "⚡",
                "AC": "✅",
                "WA": "❌",
                "TLE": "⏰",
                "MLE": "💾",
                "RE": "💥",
                "CE": "🔧",
                "SE": "⚠️"
            };
            return iconMap[this.item.status] || "❓";
        },
        statusDescription() {
            const descMap = {
                "PENDING": "排队等待中",
                "JUDGING": "正在评测",
                "WA": "检查逻辑",
                "TLE": "优化算法",
                "MLE": "减少内存使用",
                "RE": "检查运行逻辑",
                "CE": "检查语法",
                "SE": "联系管理员"
            };
            return descMap[this.item.status] || "";
        },
        showDescription() {
            return ["PENDING", "JUDGING", "WA", "TLE", "MLE", "RE", "CE", "SE"].includes(this.item.status);
        },
        memoryInMB() {
            return Math.round((this.item.memoryUsed / 1024) * 100) / 100;
        }
    }
};
</script>

<style scoped>
.test-case {
    border-radius: 8px;
    padding: 5px;
    text-align: center;
    transition: all 0.3s ease;
    border: 2px solid transparent;
    min-height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    box-sizing: border-box;
}

.test-case-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
}

.test-case-id {
    font-weight: bold;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.status-icon {
    font-size: 18px;
}

.test-case-status {
    font-weight: bold;
    margin-bottom: 8px;
    font-size: 12px;
    line-height: 1.2;
    word-wrap: break-word;
    word-break: keep-all;
    overflow-wrap: break-word;
}

.test-case-metrics {
    display: flex;
    justify-content: space-around;
    gap: 4px;
    margin-top: 8px;
    flex-wrap: wrap;
}

.test-case-time,
.test-case-memory {
    font-size: 11px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 0;
}

.metric-label {
    color: #666;
    font-size: 10px;
    white-space: nowrap;
}

.metric-value {
    font-weight: bold;
    color: #2e7d32;
    font-size: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.status-description {
    font-size: 10px;
    margin-top: 4px;
    opacity: 0.8;
    line-height: 1.2;
    word-wrap: break-word;
    word-break: keep-all;
    overflow-wrap: break-word;
}

/* 状态样式 */
.status-pending {
    background: linear-gradient(135deg, #f5f5f5, #e8e8e8);
    color: #666;
    border-color: #ddd;
}

.status-judging {
    background: linear-gradient(135deg, #fff3cd, #ffeaa7);
    color: #856404;
    border-color: #ffd93d;
    animation: pulse 2s infinite;
}

.status-ac {
    background: linear-gradient(135deg, #d4edda, #e1f3d8);
    color: #67c23a;
    border-color: #28a745;
    box-shadow: 0 2px 8px rgba(40, 167, 69, 0.2);
}

.status-wa {
    background: linear-gradient(135deg, #f8d7da, #f1b0b7);
    color: #721c24;
    border-color: #dc3545;
}

.status-tle {
    background: linear-gradient(135deg, #fff3cd, #ffeaa7);
    color: #856404;
    border-color: #ffc107;
}

.status-mle {
    background: linear-gradient(135deg, #d1ecf1, #bee5eb);
    color: #0c5460;
    border-color: #17a2b8;
}

.status-re {
    background: linear-gradient(135deg, #f8d7da, #f1b0b7);
    color: #721c24;
    border-color: #dc3545;
}

.status-ce {
    background: linear-gradient(135deg, #e2e3e5, #d6d8db);
    color: #383d41;
    border-color: #6c757d;
}

.status-se {
    background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
    color: #b7950b;
    border-color: #f39c12;
}

.status-unknown {
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    color: #6c757d;
    border-color: #adb5bd;
}

@keyframes pulse {
    0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.4);
    }

    50% {
        transform: scale(1.02);
        box-shadow: 0 0 0 8px rgba(255, 193, 7, 0);
    }

    100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(255, 193, 7, 0);
    }
}

.test-case:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
