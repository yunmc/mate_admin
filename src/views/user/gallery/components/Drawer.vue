<template>
  <div class="setViersion">
    <el-dialog v-model="drawerVisible" title="添加图片" width="45%" @before-close="handleClose">
      <el-form
        ref="ruleFormRef"
        label-width="100px"
        label-suffix=" :"
        :rules="rules"
        :disabled="drawerProps.isView"
        :model="saveParams"
        :hide-required-asterisk="drawerProps.isView"
      >
        <el-form-item label="posters" prop="images">
          <UploadImgs v-model:file-list="saveParams.images" :api="uploadFile" :limit="10" height="140px" width="140px">
            <template #empty>
              <el-icon><Picture /></el-icon>
              <span>请上传照片</span>
            </template>
            <template #tip> 最多上传 10 张照片 </template>
          </UploadImgs>
        </el-form-item>
        <el-form-item label="关联AI" prop="client_type">
          <el-select style="width: 100%" v-model="saveParams.ai_uid" class="m-2" placeholder="请选择AI">
            <el-option v-for="item in drawerProps.aiUsers" :key="item.ai_uid" :label="item.ai_name" :value="item.ai_uid" />
          </el-select>
        </el-form-item>

        <el-form-item label="照片等级" prop="client_type">
          <el-select style="width: 100%" v-model="saveParams.pic_level" class="m-2" placeholder="请选择">
            <el-option v-for="item in optionsLevel" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
          <el-button @click="drawerVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive } from "vue";
// import { genderType } from "@/utils/serviceDict";
import { ElMessage, FormInstance } from "element-plus";
// import WangEditor from "@/components/WangEditor/index.vue";
import { App } from "@/api/interface";
import UploadImgs from "@/components/Upload/Imgs.vue";
import { uploadFile } from "@/api/gallery";
import { deepClone } from "@/utils/index";
import { useRoute } from "vue-router";

const route = useRoute();

// 0:ios(web) 1:android 2:web大尺度 3:web
let ai_platform = 0;
if (route.name === "gallery2") {
  ai_platform = 1;
} else if (route.name === "gallery3") {
  ai_platform = 2;
} else if (route.name === "gallery4") {
  ai_platform = 3;
}

const rules = reactive({});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<App.ResConfig>;
  api?: (params: any) => Promise<any>;
  aiUsers?: any;
  getTableList?: () => void;
}
const optionsLevel = [
  {
    value: "1",
    label: "一级"
  },
  {
    value: "2",
    label: "二级"
  },
  {
    value: "3",
    label: "三级"
  },
  {
    value: "4",
    label: "四级"
  }
];

const saveParams = ref({
  images: [],
  ai_uid: "",
  pic_level: "1"
});

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {},
  aiUsers: []
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  saveParams.value.images = [];
  saveParams.value.ai_uid = "";
  saveParams.value.pic_level = "1";
  console.log("params", params);
};

const handleClose = () => {
  saveParams.value.images = [];
  saveParams.value.ai_uid = "";
  saveParams.value.pic_level = "1";
  console.log("saveParams.value", saveParams.value);
  drawerVisible.value = false;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  if (saveParams.value.images.length < 1) {
    ElMessage.error("请上传图片");
    return false;
  }
  if (saveParams.value.ai_uid == "") {
    ElMessage.error("请关联AI");
    return false;
  }
  let params = deepClone(saveParams.value);
  let imagesDeep = [];
  params.images.forEach((element: any) => {
    imagesDeep = deepClone(element);
    element.pic_fuzzy_url = imagesDeep.url.pic_fuzzy_url;
    element.pic_source_url = imagesDeep.url.pic_source_url;
    console.log("element", element);
  });
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!({ ...params, ai_platform });
      ElMessage.success({ message: `上传成功！` });
      drawerProps.value.getTableList!();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>
<style lang="scss">
.setViersion {
  .el-form-item__label {
    width: 90px;
    margin-right: 10px;
  }
}
</style>
