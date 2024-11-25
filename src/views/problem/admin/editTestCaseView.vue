<template>
    <div class="testcase-container">
        <el-card class="testcase-form">
            <div slot="header">
                <el-button type="text" @click="$router.push(`/problem/${problemId}`)">
                    <i class="el-icon-back"></i> 返回
                </el-button>
                <h1>测试用例管理</h1>
            </div>

            <!-- 已有的测试用例列表 -->
            <div class="current-testcases">
                <h3>当前测试用例</h3>
                <el-table :data="testcases" style="width: 100%">
                    <el-table-column prop="id" label="编号" width="80"></el-table-column>
                    <el-table-column prop="input" label="输入"></el-table-column>
                    <el-table-column prop="expectedOutput" label="输出"></el-table-column>
                    <el-table-column label="操作" width="120">
                        <template slot-scope="scope">
                            <el-button type="danger" size="mini" @click="removeTestCase(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- 添加新测试用例的表单 -->
            <div class="add-testcase">
                <h3>添加测试用例</h3>
                <el-form :model="testcaseForm" label-width="80px">
                    <el-form-item label="输入">
                        <el-input type="textarea" v-model="testcaseForm.input" rows="4"></el-input>
                    </el-form-item>
                    <el-form-item label="输出">
                        <el-input type="textarea" v-model="testcaseForm.expectedOutput" rows="4"></el-input>
                    </el-form-item>
                    <el-form-item label="作为样例">
                        <el-switch v-model="testcaseForm.isSample"></el-switch>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addTestCase">添加</el-button>
                        <el-button @click="resetForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
import { getTestCases, addTestCase, deleteTestCase } from '@/api/problem'

export default {
    name: 'EditTestCaseView',
    data() {
        return {
            problemId: '',
            testcases: [],
            testcaseForm: {
                input: '',
                expectedOutput: '',
                isSample: false
            }
        }
    },
    mounted() {
        this.problemId = this.$route.params.problemId
        this.fetchTestCases()
    },
    methods: {
        async fetchTestCases() {
            try {
                const { data } = await getTestCases(this.problemId)
                this.testcases = data
            } catch (error) {
                this.$message.error('获取测试用例失败')
            }
        },
        async addTestCase() {
            try {
                // TODO: 调用添加测试用例的API
                await addTestCase({
                    problemId: this.problemId,
                    isSample: this.testcaseForm.isSample ? 1 : 0,
                    input: this.testcaseForm.input,
                    expectedOutput: this.testcaseForm.expectedOutput
                })
                await this.fetchTestCases()
                this.$message.success('添加测试用例成功')
                this.resetForm()
            } catch (error) {
                console.log(error);
                this.$message.error('添加测试用例失败')
            }
        },
        async removeTestCase(testcaseId) {
            try {
                await deleteTestCase(testcaseId)
                await this.fetchTestCases()
                this.$message.success('删除测试用例成功')
            } catch (error) {
                this.$message.error('删除测试用例失败')
            }
        },
        resetForm() {
            this.testcaseForm = {
                input: '',
                expectedOutput: ''
            }
        }
    }
}
</script>

<style scoped>
.testcase-container {
    padding: 20px;
}

.testcase-form {
    margin-bottom: 20px;
}

.current-testcases, .add-testcase {
    margin: 20px 0;
}
</style>
