<template>
    <div>
        <h1>更新头像</h1>
        <el-upload class="avatar-uploader" action="#" :http-request="uploadAvatar" :show-file-list="false"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-button type="primary" @click="updateAvatar">更新头像</el-button>
    </div>
</template>

<script>
import { uploadFile } from '@/api/common';
import { updateUserAvatar } from '@/api/user';

export default {
    data() {
        return {
            imageUrl: ''
        };
    },
    methods: {
        async uploadAvatar(options) {
            try {
                const formData = new FormData();
                formData.append('file', options.file);
                const response = await uploadFile(formData); // 调用uploadFile API上传文件,传入formData表单数据,等待上传完成获取响应
                this.imageUrl = response.data;
            } catch (error) {
                this.$message.error('上传头像失败，请重试');
            }
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        async updateAvatar() {
            await updateUserAvatar(this.imageUrl);
            this.$message.success('头像更新成功');
        }
    }
}
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
