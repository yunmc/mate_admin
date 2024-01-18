<template>
  <el-drawer
    v-model="drawerVisible"
    :destroy-on-close="true"
    @before-close="handleClose"
    size="760px"
    :title="`${drawerProps.title}`"
  >
    <el-form
      ref="ruleFormRef"
      label-width="178px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <div class="title">运营位配置</div>

      <el-form-item label="活动标题" prop="activity_title">
        <el-input v-model="drawerProps.row!.activity_title" placeholder="activity_title" clearable></el-input>
      </el-form-item>
      <el-form-item label="活动图" prop="banner_url">
        <UploadImg v-model:image-url="drawerProps.row!.banner_url" width="135px" height="135px" :file-size="3">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传照片</span>
          </template>
          <template #tip> （运营图尺寸 1029*216） </template>
        </UploadImg>
      </el-form-item>

      <el-form-item label="跳转类型" prop="activity_platform">
        <div class="el_select flex">
          <el-select v-model="drawerProps.row!.activity_platform" placeholder="请选择">
            <el-option
              v-for="item in drawerProps.getPlatformStatus"
              :key="item.stateLabel"
              :label="item.stateLabel"
              :value="item.stateValue"
            >
            </el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="跳转链接" prop="activity_scheme">
        <el-input v-model="drawerProps.row!.activity_scheme" placeholder="activity_scheme" clearable></el-input>
      </el-form-item>
      <!-- <el-form-item label="跳转参数" prop="episode_sort">
        <el-input v-model="drawerProps.row!.episode_sort" placeholder="episode_sort" clearable></el-input>
      </el-form-item> -->

      <el-form-item label="作用范围" prop="activity_target">
        <div class="el_select flex">
          <el-select v-model="drawerProps.row!.activity_target" placeholder="请选择">
            <el-option
              v-for="item in drawerProps?.getTargetStatus"
              :key="item.stateLabel"
              :label="item.stateLabel"
              :value="item.stateValue"
            >
            </el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="排序" prop="activity_weight">
        <el-input v-model="drawerProps.row!.activity_weight" placeholder="activity_weight" clearable></el-input>
      </el-form-item>
      <el-form-item label="上线时间" prop="start_time">
        <el-date-picker
          v-model="drawerProps.row!.start_time"
          type="datetime"
          placeholder="start_time"
          format="YYYY/MM/DD hh:mm:ss"
          value-format="x"
        />
      </el-form-item>
      <el-form-item label="下线时间" prop="end_time">
        <el-date-picker
          v-model="drawerProps.row!.end_time"
          type="datetime"
          placeholder="end_time"
          format="YYYY/MM/DD hh:mm:ss"
          value-format="x"
        />
      </el-form-item>

      <el-form-item label="上线状态" prop="activity_status">
        <el-switch v-model="drawerProps.row!.activity_status" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false"> 取消 </el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit"> 确定 </el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive, watch } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { User } from "@/api/interface";
import UploadImg from "@/components/Upload/Img.vue";

const rules = reactive({
  // name: [{ required: true, message: "请输入用户名" }],
  // sex: [{ required: true, message: "请选择性别" }]
});
interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<User.ResUserList>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
  getPlatformStatus?: Array<any>;
  getTargetStatus?: Array<any>;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});
const handleClose = (params: DrawerProps) => {
  drawerProps.value.isView = false;
  drawerProps.value.title = "";
  drawerProps.value.row = {};
  drawerVisible.value = false;
};
// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerProps.value.row!.start_time = drawerProps.value.row!.start_time * 1000;
  drawerProps.value.row!.end_time = drawerProps.value.row!.end_time * 1000;
  drawerProps.value.row!.activity_status = drawerProps.value.row!.activity_status == 1 ? true : false;
  drawerVisible.value = true;
};
// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  drawerProps.value.row!.activity_status = drawerProps.value.row!.activity_status ? 1 : 2;
  drawerProps.value.row!.start_time = drawerProps.value.row!.start_time / 1000;
  drawerProps.value.row!.end_time = drawerProps.value.row!.end_time / 1000;
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      const params = {
        ...drawerProps.value.row
      };
      const res = await drawerProps.value.api!(params);
      if (res.code == "200") {
        ElMessage.success({ message: `${drawerProps.value.title}成功！` });
        drawerProps.value.getTableList!();
        drawerVisible.value = false;
      } else {
        ElMessage.warning({ message: res.msg });
      }
    } catch (error) {
      console.log(error);
    }
  });
};
defineExpose({
  acceptParams
});
</script>

<style lang="scss" scoped>
.el-tag {
  margin-right: 10px;
  cursor: pointer;
}
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 15px;
  margin-bottom: 20px;
  font-weight: bold;
  border-bottom: 1px solid var(--el-border-color-lighter);
}
.el_select {
  width: 100%;
  p {
    width: 80px;
    margin-left: 20px;
  }
}
.model_main {
  // max-height: 500px;
  // overflow: auto;
}
.model_list {
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 15px;
  p {
    width: 100%;
  }
  span {
    align-items: center;
    justify-content: space-between;
    margin-left: 10px;
    font-size: 24px;
    cursor: pointer;
  }
}
</style>
