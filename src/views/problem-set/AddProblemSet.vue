<template>
  <div class="edit-problem-set-container">
    <z-header :back-url="`/problem-set`" title="创建题单"></z-header>
    <el-form :model="problemSetForm" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="题单标题">
            <el-input v-model="problemSetForm.title" size="mini"></el-input>
          </el-form-item>
        </el-col>
<!--        <el-col :span="12">-->
<!--          <el-form-item label="题单状态">-->
<!--            <el-select v-model="problemSetForm.status" size="mini">-->
<!--              <el-option label="私有" value="0"></el-option>-->
<!--              <el-option label="公开" value="1"></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="题单描述">
            <el-input type="textarea" v-model="problemSetForm.description" autosize></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <markdown-renderer :content="problemSetForm.description"></markdown-renderer>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ZHeader from '@/components/ZHeader.vue';
import MarkdownRenderer from '@/components/MarkdownRenderer.vue';
import {addProblemSet} from '@/api/problemSet';

export default {
  name: 'AddProblemSet',
  components: { ZHeader, MarkdownRenderer },
  data() {
    return {
      problemSetForm: {
        title: '',
        description: '',
      }
    }
  },
  methods: {
    async submitForm() {
      await addProblemSet(this.problemSetForm);
      this.$message.success('题单已保存（假数据）');
      this.$router.push('/problem-set');
    },
    cancel() {
      this.$router.back();
    }
  }
}
</script>

<style scoped>
.edit-problem-set-container {
  padding: 0 20px 0;
}
</style>