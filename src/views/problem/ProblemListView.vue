<template>
    <div class="problem-container">
        <el-card class="problem-list">
            <div slot="header">
                <span>题目列表</span>

                <!-- 添加题目 -->
                <el-button v-if="isLogin && userInfo.permissions.includes('problem:add')"
                    style="float: right; padding: 3px 0" type="text" @click="jump('/problem/add')">添加题目</el-button>
                <!-- 题目标签选择框 -->
                <el-button type="text" @click="drawer = true; fetchTags()" style="margin-left: 20px;">选择标签</el-button>
                <el-drawer title="选择标签" :visible.sync="drawer" direction="ltr" size="50%">
                    <el-checkbox-group v-model="problemQueryDTO.tagId" style="margin-left: 20px;">
                        <el-checkbox border v-for="tag in tags" :label="tag.id" :key="tag.id">
                            {{ tag.name }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-drawer>

                <!-- 题目难度选择框 -->
                <el-select v-model="problemQueryDTO.difficulty" placeholder="题目难度" style="margin-left: 20px;" clearable>
                    <el-option v-for="item in difficultyOptions" :key="item.value" :label="item.label"
                        :value="item.value"></el-option>
                </el-select>

                <!-- 题目名称搜索框 -->
                <el-input placeholder="输入题目或题号" style="margin-left: 20px; width: 200px;"
                    v-model="problemQueryDTO.keyword"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="fetchProblems"
                    style="margin-left: 20px;">搜索</el-button>

                <!-- 是否展示标签 -->
                <el-switch v-model="showTags" active-text="显示标签" inactive-text="隐藏标签" style="margin-left: 20px;">
                </el-switch>

                <br />
                <!-- 已选择的标签 -->
                <div style="margin-top: 10px;">
                    <el-tag v-for="tagId in problemQueryDTO.tagId" :key="tagId" closable
                        @close="problemQueryDTO.tagId = problemQueryDTO.tagId.filter(id => id !== tagId)"
                        style="margin-right: 10px;">
                        {{tags.find(tag => tag.id === tagId)?.name}}
                    </el-tag>
                </div>

            </div>
            <problemList :problems="problems" :showTags="showTags"></problemList>

            <!-- 分页 -->
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" @size-change="sizeChange"
                    :current-page="problemQueryDTO.currentPage" :page-sizes="[5, 10, 20, 50]"
                    :page-size="problemQueryDTO.limit" layout="prev, pager, next, jumper, sizes, ->, total"
                    :total="problemQueryDTO.total">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script>
import { getProblemList } from '@/api/problem';
import { getAllTags } from '@/api/problem';
import problemList from './components/problemList.vue';
import { getToken } from '@/utils/cookie';

export default {
    name: 'ProblemListView',
    components: {
        problemList
    },
    computed: {
        isLogin() {
            return getToken() != null;
        },
        userInfo() {
            return this.$store.state.userInfo;
        }
    },
    data() {
        return {
            problemQueryDTO: {
                limit: 10,
                currentPage: 1,
                keyword: '',
                tagId: [],
                difficulty: '',
                source: '',
                problemVisible: true,
            },
            drawer: false,
            problems: [],
            tags: [],
            difficultyOptions: [{
                value: '0',
                label: '入门'
            }, {
                value: '1',
                label: '简单'
            }, {
                value: '2',
                label: '简单+'
            }, {
                value: '3',
                label: '中等'
            }, {
                value: '4',
                label: '中等+'
            }, {
                value: '5',
                label: '困难'
            }, {
                value: '6',
                label: '困难+'
            }],
            showTags: true,
        }
    },
    async mounted() {
        this.fetchProblems();
    },
    methods: {
        async fetchProblems() {
            try {
                const { data } = await getProblemList(this.problemQueryDTO);
                this.problems = data.records;
                this.problemQueryDTO.total = data.total;
            } catch (error) {
                this.$message.error('获取题目列表失败');
            }
        },
        async fetchTags() {
            try {
                const { data } = await getAllTags();
                this.tags = data;
            } catch (error) {
                this.$message.error('获取标签失败');
            }
        },
        handleCurrentChange(val) {
            this.problemQueryDTO.currentPage = val;
            this.fetchProblems();
        },
        sizeChange(size) {
            this.problemQueryDTO.limit = size
            this.fetchProblems()
        },
        jump(url) {
            this.$router.replace(url);
        },
    }
}
</script>

<style scoped>
.problem-list {
    margin-bottom: 20px;
}

.pagination {
    margin-top: 20px;
    text-align: center;
}
</style>
