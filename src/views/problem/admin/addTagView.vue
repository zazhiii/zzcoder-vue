
<template>
    <div class="tag-container">
        <el-card class="tag-form">
            <div slot="header">
                <el-button type="text" @click="$router.push(`/problem/${problemId}`)">
                    <i class="el-icon-back"></i> 返回
                </el-button>
                <h1>修改标签</h1>
            </div>

            <div class="current-tags">
                <h3>当前标签</h3>
                <el-tag 
                    v-for="tag in problemTags" 
                    :key="tag.id"
                    closable
                    @close="removeTag(tag.id)"
                    style="margin-right: 10px; margin-bottom: 10px;">
                    {{ tag.name }}
                </el-tag>
            </div>

            <div class="all-tags">
                <h3>所有标签</h3>
                <el-tag
                    v-for="tag in allTags"
                    :key="tag.id"
                    style="margin-right: 10px; margin-bottom: 10px;"
                    @click="addTag(tag.id)"
                    :type="problemTags.some(t => t.id === tag.id) ? 'info' : ''"
                    :class="{ 'clickable': !problemTags.some(t => t.id === tag.id) }">
                    {{ tag.name }}
                </el-tag>
            </div>
        </el-card>
    </div>
</template>

<script>
import { getAllTags, getProblemInfo, addTagToProblem, removeTagFromProblem } from '@/api/problem'

export default {
    name: 'AddTagView',
    data() {
        return {
            problemId: '',
            allTags: [],
            problemTags: []
        }
    },
    async mounted() {
        this.problemId = this.$route.params.problemId
        await this.fetchData()
    },
    methods: {
        async fetchData() {
            try {
                const { data : tags } = await getAllTags()
                this.allTags = tags
                const { data : problemInfo} = await getProblemInfo(this.problemId)
                this.problemTags = problemInfo.tags
            } catch (error) {
                this.$message.error('获取标签数据失败')
            }
        },
        async addTag(tagId) {
            if (this.problemTags.some(t => t.id === tagId)) {
                return
            }
            try {
                await addTagToProblem(this.problemId, tagId)
                await this.fetchData()
                this.$message.success('添加标签成功')
            } catch (error) {
                this.$message.error('添加标签失败')
            }
        },
        async removeTag(tagId) {
            try {
                await removeTagFromProblem(this.problemId, tagId)
                await this.fetchData()
                this.$message.success('移除标签成功')
            } catch (error) {
                this.$message.error('移除标签失败')
            }
        }
    }
}
</script>

<style scoped>
.tag-container {
    padding: 20px;
}

.tag-form {
    margin-bottom: 20px;
}

.current-tags, .all-tags {
    margin: 20px 0;
}

.clickable {
    cursor: pointer;
}

.clickable:hover {
    opacity: 0.8;
}
</style>
