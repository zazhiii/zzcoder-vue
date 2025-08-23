<template>
  <div class="tag-container">
    <el-card class="tag-form">
      <z-header :back-url="`/problem/${problemId}`" title="修改标签"></z-header>

      <div class="current-tags">
        <h3>当前标签</h3>
        <el-tag v-for="tag in problemTags" :key="tag.id" closable @close="removeTag(tag.id)"
          style="margin-right: 10px; margin-bottom: 10px;">
          {{ tag.name }}
        </el-tag>
      </div>

      <div class="all-tags">
        <h3>所有标签</h3>
        <el-tag v-for="tag in allTags" :key="tag.id" style="margin-right: 10px; margin-bottom: 10px;"
          @click="addTag(tag.id)" :type="problemTags.some(t => t.id === tag.id) ? 'info' : ''"
          :class="{ 'clickable': !problemTags.some(t => t.id === tag.id) }">
          {{ tag.name }}
        </el-tag>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getAllTags, getProblemTags, addTagToProblem, removeTagFromProblem } from '@/api/problem'
import ZHeader from "@/components/ZHeader.vue";

export default {
  name: 'AddTagView',
  components: { ZHeader },
  data() {
    return {
      problemId: '',
      allTags: [],
      problemTags: []
    }
  },
  async created() {
    this.problemId = this.$route.params.problemId;
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.allTags = await getAllTags();
      this.problemTags = await getProblemTags(this.problemId);
    },
    async addTag(tagId) {
      if (this.problemTags.some(t => t.id === tagId)) {
        return
      }
      await addTagToProblem(this.problemId, tagId)
      await this.fetchData()
      this.$message.success('添加标签成功')

    },
    async removeTag(tagId) {
      await removeTagFromProblem(this.problemId, tagId)
      await this.fetchData()
      this.$message.success('移除标签成功')
    }
  },


}
</script>

<style scoped>
.tag-container {
  padding: 20px;
}

.tag-form {
  margin-bottom: 20px;
}

.current-tags,
.all-tags {
  margin: 20px 0;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  opacity: 0.8;
}
</style>
