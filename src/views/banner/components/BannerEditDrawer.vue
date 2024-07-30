<template>
  <el-drawer v-model="drawerVisible" size="780px" title="渠道配置" :destroy-on-close="true" @before-close="beforeCloseDrawer">
    <el-form
      ref="ruleFormRef"
      label-width="208px"
      label-suffix=" :"
      :disabled="drawerProps.isView"
      :rules="rules"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="活动图" prop="banner_url">
        <UploadImg v-model:image-url="drawerProps.row!.banner_url" width="135px" height="135px" :file-size="1">
          <template #empty>
            <el-icon><Avatar /></el-icon>
            <span>请选择上传图片</span>
          </template>
        </UploadImg>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false"> 取消 </el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit"> 确定 </el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="BannerEditDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import UploadImg from "@/components/Upload/Img.vue";

interface DrawerProps {
  row: any;
  isView: boolean;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  row: {},
  isView: false
});

const rules = reactive({});

const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerProps.value.row!.online_status = drawerProps.value.row!.online_status == 1 ? true : false;
  drawerVisible.value = true;
};

const ruleFormRef = ref<FormInstance>();
const handleSubmit = async () => {
  ruleFormRef.value!.validate(async valid => {
    drawerProps.value.row!.online_status = drawerProps.value.row!.online_status ? 1 : 0;
    if (!valid) {
      return;
    }
    try {
      const params = {
        banner_url: drawerProps.value.row!.banner_url
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
  drawerProps.value.isView = false;
  drawerProps.value.row = {};
  drawerVisible.value = false;
};

defineExpose({
  acceptParams
});
</script>

<style lang="scss" scoped></style>
