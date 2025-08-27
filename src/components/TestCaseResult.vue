<template>
    <div class="test-case" :class="statusClass">
        <div class="test-case-id"># {{ index }}</div>
        <div class="test-case-status">{{ item.status }}</div>

        <!-- 只有 AC 才展示时间和内存 -->
        <template v-if="item.status === 'AC'">
            <div class="test-case-time">{{ item.timeUsed }} ms</div>
            <div class="test-case-memory">{{ memoryInMB }} MB</div>
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
                case "AC":
                    return "status-ac";
                default:
                    return "status-error";
            }
        },
        memoryInMB() {
            return Math.round((this.item.memoryUsed / 1024) * 100) / 100;
        }
    }
};
</script>

<style scoped>
.test-case {
    border-radius: 6px;
    padding: 8px 10px;
    text-align: center;
    transition: background-color 0.3s;
}

/* 状态样式 */
.status-pending {
    background-color: #f5f5f5;
    color: #888;
}

.status-ac {
    background-color: #e6ffed;
    color: #2e7d32;
    font-weight: bold;
}

.status-error {
    background-color: #ffe6e6;
    color: #c62828;
    font-weight: bold;
}

.test-case-id {
    font-weight: bold;
    margin-bottom: 4px;
}

.test-case-status {
    margin-bottom: 4px;
}

.test-case-time,
.test-case-memory {
    font-size: 12px;
    color: #555;
}
</style>
