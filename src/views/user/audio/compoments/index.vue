<template>
  <div class="setViersion">
    <el-dialog v-model="drawerVisible" :title="drawerProps.isView ? '添加' : '编辑'" width="35%" @before-close="handleClose">
      <el-form
        ref="ruleFormRef"
        label-width="120px"
        label-suffix=" :"
        :rules="rules"
        :model="drawerProps.row"
        :hide-required-asterisk="drawerProps.isView"
      >
        <el-form-item label="音频名称" prop="voice_title">
          <el-input v-model="drawerProps.row!.voice_title" placeholder="请输入音频名称" clearable></el-input>
        </el-form-item>

        <el-form-item label="上传音频" prop="source_url">
          <UploadVoice v-model:image-url="drawerProps.row!.source_url" width="300px" :file-size="10">
            <template #empty>
              <span>请上传音频文件</span>
            </template>
            <!-- <template #tip> 音频大小不能超过 10M </template> -->
          </UploadVoice>
        </el-form-item>

        <el-form-item label="音频ID" prop="voice_id">
          <el-input v-model="drawerProps.row!.voice_id" placeholder="请输入音频ID" clearable></el-input>
        </el-form-item>

        <el-form-item label="排序" prop="weight">
          <el-input v-model="drawerProps.row!.weight" placeholder="请输入排序" clearable></el-input>
        </el-form-item>

        <el-form-item label="是否会员" prop="is_vip">
          <el-radio v-model="drawerProps.row!.is_vip" label="1">是</el-radio>
          <el-radio v-model="drawerProps.row!.is_vip" label="0">否</el-radio>
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

<script setup lang="ts" name="userAudio">
import { ref, reactive } from "vue";
// import { genderType } from "@/utils/serviceDict";
import { ElMessage, FormInstance } from "element-plus";
// import WangEditor from "@/components/WangEditor/index.vue";
import { App } from "@/api/user/audio";
import UploadVoice from "@/components/Upload/voice.vue";

const rules = reactive({
  // upgrade_version: [{ required: true, message: "请输入版本号" }],
  // upgrade_content: [{ required: true, message: "请输入更新内容" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<App.ResConfig>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  console.log("params", params);
  drawerProps.value = params;
  // drawerProps.value.is_vip = String(drawerProps.value.is_vip);
  drawerVisible.value = true;
};

const handleClose = (params: DrawerProps) => {
  drawerVisible.value = false;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  console.log("drawerProps.value", drawerProps.value.row);
  // drawerProps.value.row.name = drawerProps.value.row.ai_name;
  // drawerProps.value.row.desc = drawerProps.value.row.ai_desc;
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
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
