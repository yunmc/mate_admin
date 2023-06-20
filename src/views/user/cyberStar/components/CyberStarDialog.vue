<template>
  <el-dialog v-model="showDialog" width="600px" center :show-close="false" custom-class="my-dialog">
    <h3>账户信息</h3>
    <el-form>
      <el-form-item label="用户账号：">
        <span>{{ id }}</span>
      </el-form-item>
    </el-form>

    <h3>合作信息</h3>
    <el-form :inline="true" :model="form" class="demo-form-inline">
      <el-form-item label="真实姓名：">
        <el-input v-model="form.username" placeholder="请输入真实姓名" />
      </el-form-item>
      <el-form-item label="社交媒体网名：">
        <el-input v-model="form.nickname" placeholder="请输入社交媒体网名" />
      </el-form-item>
      <el-form-item label="分成比例：">
        <el-input v-model="form.divideInto" placeholder="请输入整数单位为%" />
      </el-form-item>
      <el-form-item label="合作有效期：">
        <el-input v-model="form.cooperateLifespan" placeholder="请输入真实姓名" />
      </el-form-item>
      <el-form-item label="合作个人信息：">
        <el-input v-model="form.cooperateUserInfo" placeholder="请输入真实姓名" />
      </el-form-item>
      <el-form-item label="合同上传：">
        <el-input v-model="form.contract" placeholder="请输入真实姓名" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDialog = false"> 取消 </el-button>
        <el-button type="primary" @click="showDialog = false"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="CyberStarDialog">
import { ref } from "vue";

const showDialog = ref(false);
const id = ref("324324");
const form = ref({
  username: "",
  nickname: "",
  divideInto: "",
  cooperateLifespan: "",
  cooperateUserInfo: "",
  contract: ""
});

// 初始化对话框;
const initDialog = (params: any) => {
  form.value = params;
  showDialog.value = true;
};

defineExpose({
  initDialog
});
</script>

<style lang="scss" scoped>
h3 {
  width: 100%;
  display: block;
  padding: 12px 25px;
  margin-top: 0;
  margin-left: -25px;
  background: #dedfe0;
}
:deep(.el-dialog__header) {
  display: none;
}
:deep(.el-dialog__body) {
  padding-top: 0;
}
</style>
