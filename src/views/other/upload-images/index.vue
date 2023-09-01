<template>
  <div class="main-box">
    <div class="upload content-box flx-start">
      <!-- 多图上传 -->
      <div class="content flx-start">
        <UploadImgs v-model:file-list="fileList1" width="350px">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传照片</span>
          </template>
          <template #tip> 长方形组件（可拖拽上传） </template>
        </UploadImgs>
      </div>
      {{ fileList1 }}
    </div>
  </div>
</template>

<script setup lang="ts" name="uploadFile">
import { ref } from "vue";
import UploadImgs from "@/components/Upload/uploads.vue";

const fileList1 = ref([]);
</script>

<style scoped lang="scss">
.main-box {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .upload {
    box-sizing: border-box;
    padding: 10px 18px;
    margin-bottom: 10px;
    overflow-x: hidden;
    background-color: var(--el-bg-color);
    border: 1px solid var(--el-border-color-light);
    border-radius: 6px;
    box-shadow: 0 0 12px rgb(0 0 0 / 5%);
    .el-upload-list {
      display: none;
    }
    .content {
      float: left;
      width: 400px;
    }
  }
}
</style>
