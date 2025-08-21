<template>
    <!-- 题目列表 -->
    <el-table :data="problems" style="width: 100%">
        <el-table-column prop="problemId" label="题号" width="80"></el-table-column>
        <el-table-column prop="title" label="标题">
            <template slot-scope="scope">
                <el-link type="primary" @click="jump(`/problem/${scope.row.id}`)">
                    {{ scope.row.title }}
                </el-link>
            </template>
        </el-table-column>
        <el-table-column prop="tags" :label="showTags ? '标签' : ''">
            <template slot-scope="scope" v-if="showTags">
                <el-tag v-for="tag in scope.row.tags" :key="tag.id">{{ tag.name }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="difficulty" label="难度" width="100">
            <template slot-scope="scope">
                <DifficultyTag :difficulty="scope.row.difficulty" />
            </template>
        </el-table-column>
        <el-table-column prop="acceptance" label="通过率" width="100"></el-table-column>
    </el-table>
</template>

<script>
import DifficultyTag from './DifficultyTag.vue';

export default {
    name: 'problemList',
    components: {
      DifficultyTag
    },
    props: {
        problems: {
            type: Array,
            required: true
        },
        showTags: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        jump(url) {
            this.$router.replace(url);
        }
    }
}
</script>
