<template>
  <div class="upload content-box">
    <!-- 多图上传 -->
    <div class="card img-box">
      <div class="upload-list">
        <UploadImgs v-model:file-list="fileList1" width="250px">
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
import { ref, reactive } from "vue";
import { FormInstance } from "element-plus";
import UploadImgs from "@/components/Upload/Imgs.vue";

const fileList1 = ref([]);
</script>

<style scoped lang="scss"></style>
