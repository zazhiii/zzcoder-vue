export const elTableFilters = {
    LANGUAGE_FILTER: [{ text: 'C', value: 'C' }, { text: 'C++', value: 'C++' }, { text: 'Java', value: 'Java' }],
    STATUS_FILTER: [
        { text: '等待中', value: 'PENDING' },
        { text: '评测中', value: 'JUDGING' },
        { text: '答案正确', value: 'AC' },
        { text: '错误答案', value: 'WA' },
        { text: '超出时间限制', value: 'TLE' },
        { text: '超出内存限制', value: 'MLE' },
        { text: '运行错误', value: 'RE' },
        { text: '编译错误', value: 'CE' },
        { text: '系统错误', value: 'SE' }
    ],
}