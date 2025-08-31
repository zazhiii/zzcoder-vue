/**
 * 判题结果相关的工具函数
 */

// 判题结果映射配置
export const JUDGE_RESULTS = {
    // 基本判题结果
    AC: { label: '通过', type: 'success' },
    WA: { label: '答案错误', type: 'danger' },
    TLE: { label: '超时', type: 'warning' },
    MLE: { label: '内存超限', type: 'warning' },
    RE: { label: '运行错误', type: 'danger' },
    CE: { label: '编译错误', type: 'info' },
    PE: { label: '格式错误', type: 'warning' },

    // 系统状态
    JUDGING: { label: '评判中', type: 'info' },
    PENDING: { label: '等待中', type: 'info' },
    SE: { label: '系统错误', type: 'danger' }
};

/**
 * 获取判题结果的类型（用于标签颜色）
 * @param {string} result 判题结果代码
 * @returns {string} Element UI 标签类型
 */
export function getResultType(result) {
    return JUDGE_RESULTS[result]?.type || 'info';
}

/**
 * 获取判题结果的文本描述
 * @param {string} result 判题结果代码
 * @returns {string} 中文描述
 */
export function getResultText(result) {
    return JUDGE_RESULTS[result]?.label || '未知';
}

/**
 * 获取基本判题结果列表（不包含系统状态）
 * @returns {Array} 判题结果列表
 */
export function getBasicJudgeResults() {
    return Object.entries(JUDGE_RESULTS)
        .filter(([key]) => !['JUDGING', 'PENDING', 'SE'].includes(key))
        .map(([value, config]) => ({
            value,
            label: config.label,
            type: config.type
        }));
}

/**
 * 获取所有判题结果列表（包含系统状态）
 * @returns {Array} 完整的判题结果列表
 */
export function getAllJudgeResults() {
    return Object.entries(JUDGE_RESULTS).map(([value, config]) => ({
        value,
        label: config.label,
        type: config.type
    }));
}

/**
 * 判断是否为成功状态
 * @param {string} result 判题结果代码
 * @returns {boolean} 是否为成功状态
 */
export function isSuccessResult(result) {
    return result === 'AC';
}

/**
 * 判断是否为处理中状态
 * @param {string} result 判题结果代码
 * @returns {boolean} 是否为处理中状态
 */
export function isPendingResult(result) {
    return ['JUDGING', 'PENDING'].includes(result);
}

/**
 * 判断是否为错误状态
 * @param {string} result 判题结果代码
 * @returns {boolean} 是否为错误状态
 */
export function isErrorResult(result) {
    return ['WA', 'RE', 'SE'].includes(result);
}

/**
 * 判断是否为资源限制错误
 * @param {string} result 判题结果代码
 * @returns {boolean} 是否为资源限制错误
 */
export function isResourceLimitResult(result) {
    return ['TLE', 'MLE'].includes(result);
}
