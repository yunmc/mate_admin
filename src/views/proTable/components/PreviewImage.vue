<template>
  <el-image-viewer v-if="showViewer" :initial-index="initialIndex" @close="closeViewer" :url-list="srcList"> </el-image-viewer>
</template>

<script setup lang="ts" name="PreviewImage">
import { ref } from "vue";
import { User } from "@/api/interface";

interface DrawerProps {
  index: number;
  row: Partial<User.ResUserList>;
}

const srcList = ref();

const showViewer = ref(false);

const initialIndex = ref(0);

const previewParams = (params: DrawerProps) => {
  if (params.index == 9) {
    initialIndex.value = 0;
    srcList.value = [];
    srcList.value.push(params.row.avatar);
  } else {
    srcList.value = [];
    initialIndex.value = params.index;
    srcList.value = params.row.posters;
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
