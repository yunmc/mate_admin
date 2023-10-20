<template>
  <el-dialog v-model="dialogVisible" title="个人信息" width="500px" draggable>
    <span>{{ userInfo }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/modules/user";
import { useRouter } from "vue-router";
const dialogVisible = ref(false);
const openDialog = () => {
  dialogVisible.value = true;
};

const router = useRouter();
const userStore = useUserStore();

const userInfo = computed(() => userStore.userInfo);

defineExpose({ openDialog });
</script>
