<template>
  <el-drawer v-model="drawerVisible" size="780px" title="Blog配置" :destroy-on-close="true" @before-close="beforeCloseDrawer">
    <el-form
      ref="ruleFormRef"
      label-width="208px"
      label-suffix=" :"
      :disabled="drawerProps.isView"
      :rules="rules"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="文章标题" prop="article_title">
        <el-input v-model="drawerProps.row!.article_title" placeholder="" clearable></el-input>
      </el-form-item>

      <el-form-item label="文章封面" prop="banner_url">
        <UploadImg v-model:image-url="drawerProps.row!.banner_url" width="135px" height="135px" :file-size="1">
          <template #empty>
            <el-icon><Avatar /></el-icon>
            <span>请选择上传图片</span>
          </template>
        </UploadImg>
      </el-form-item>

      <el-form-item label="排序权重" prop="article_weight">
        <el-input v-model="drawerProps.row!.article_weight" placeholder="" clearable></el-input>
      </el-form-item>
    </el-form>

    <el-form-item label="文章内容" prop="article_content">
      <WangEditor v-model:value="drawerProps.row!.article_content" placeholder="请输入文章内容" height="300px" />
    </el-form-item>
    <template #footer>
      <el-button @click="drawerVisible = false"> 取消 </el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit"> 确定 </el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="BlogEditDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import UploadImg from "@/components/Upload/Img.vue";
import WangEditor from "@/components/WangEditor/index.vue";

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
        id: drawerProps.value.row!.id,
        article_title: drawerProps.value.row!.article_title,
        article_content: drawerProps.value.row!.article_content,
        article_weight: drawerProps.value.row!.article_weight,
        article_status: drawerProps.value.row!.article_status,
        banner_url: drawerProps.value.row!.banner_url,
        ai_platform: 2
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
