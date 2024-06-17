<template>
  <el-dialog
    v-model="drawerVisible"
    width="450px"
    :title="drawerProps.isEdit ? '编辑分类' : '添加分类'"
    :destroy-on-close="true"
    @before-close="beforeCloseDrawer"
  >
    <el-form ref="ruleFormRef" label-width="80px" label-suffix=" :" :rules="rules" :model="drawerProps.row">
      <el-form-item label="分类名称" prop="category_name">
        <el-input v-model="drawerProps.row!.category_name" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item label="排序权重" prop="category_weight">
        <el-input v-model="drawerProps.row!.category_weight" placeholder="" type="number" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false"> 取消 </el-button>
      <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="LabelEditDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";

interface DrawerProps {
  row: any;
  isEdit: boolean;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  row: {},
  isEdit: false
});

const rules = reactive({});

const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

const ruleFormRef = ref<FormInstance>();
const handleSubmit = async () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) {
      return;
    }
    if (!drawerProps.value.api) {
      return;
    }
    try {
      const params = {
        ...drawerProps.value.row,
        category_weight: Number(drawerProps.value.row.category_weight)
      };
      const res = await drawerProps.value.api!(params);
      if (res.code == "200") {
        ElMessage.success({ message: `提交成功！` });
        drawerProps.value.getTableList!();
        drawerVisible.value = false;
      } else {
        ElMessage.warning({ message: res.msg });
      }
    } catch (e) {
      ElMessage.warning({ message: (e as any).toString() });
    }
  });
};
const beforeCloseDrawer = () => {
  drawerProps.value.isEdit = false;
  drawerProps.value.row = {};
  drawerVisible.value = false;
};

defineExpose({
  acceptParams
});
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 15px;
  margin-bottom: 20px;
  font-weight: bold;
  border-bottom: 1px solid var(--el-border-color-lighter);
}
</style>
