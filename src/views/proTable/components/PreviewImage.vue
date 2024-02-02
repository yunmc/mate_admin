<template>
  <el-image-viewer v-if="showViewer" :initial-index="initialIndex" @close="closeViewer" :url-list="srcList"> </el-image-viewer>
</template>

<script setup lang="ts" name="PreviewImage">
import { ref } from "vue";
import { isArray } from "@/utils/is";

interface DrawerProps {
  index: number;
  row: any;
}

const srcList = ref();

const showViewer = ref(false);

const initialIndex = ref(0);

const previewParams = (params: DrawerProps) => {
  srcList.value = [];
  initialIndex.value = params.index;
  if (!isArray(params.row)) {
    srcList.value.push(params.row);
  } else {
    srcList.value = params.row;
  }
  showViewer.value = true;
};

const closeViewer = () => {
  showViewer.value = false;
};

defineExpose({
  previewParams
});
</script>
