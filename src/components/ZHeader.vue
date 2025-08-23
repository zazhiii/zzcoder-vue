<script>
export default {
  name: 'ZHeader',
  props:{
    backUrl: {
      type: String,
      required: true
    },
    title: String,
  }
}
</script>

<template>
  <div class="header">
    <el-button type="text" @click="$router.push(backUrl)" class="back">
      <i class="el-icon-back"></i> 返回
    </el-button>
    <h1 class="title">{{title}}</h1>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center; /* 垂直居中 */
  position: relative; /* 方便绝对定位按钮 */
  justify-content: center; /* 让标题在水平居中 */
  margin-bottom: 20px; /* 底部留出空间 */
}

.header .title {
  margin: 0;
}

.header .back {
  position: absolute; /* 让返回按钮固定在左边 */
  left: 0;
}
</style>