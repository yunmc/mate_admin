<template>
  <div class="setViersion">
    <el-dialog v-model="drawerVisible" :title="drawerProps.isView ? '添加' : '编辑'" width="30%" @before-close="handleClose">
      <el-form-item label="版本类型" prop="create_by">
        <el-select style="width: 100%" v-model="drawerProps.row!.isios" class="m-2" placeholder="Select">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="最新版本号" prop="create_by">
        <el-input v-model="drawerProps.row!.mbti" placeholder="mbti" clearable></el-input>
      </el-form-item>

      <el-form-item label="更新方式" prop="create_by">
        <el-radio v-model="drawerProps.row!.radio" label="1">推荐更新</el-radio>
        <el-radio v-model="drawerProps.row!.radio" label="2">强制更新</el-radio>
      </el-form-item>

      <el-form-item label="更新内容" prop="create_by">
        <el-input v-model="drawerProps.row!.coop_info" :rows="3" type="textarea" placeholder="Please input" />
        <!-- <WangEditor v-model:value="drawerProps.row!.coop_info" placeholder="请输入合作信息备注" height="300px" /> -->
      </el-form-item>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="drawerVisible = false"> 确定 </el-button>
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
import { User } from "@/api/interface";

const rules = reactive({
  ai_name: [{ required: true, message: "请输入用户名" }],
  ai_state: [{ required: true, message: "请选择状态" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<User.ResUserList>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const options = [
  {
    value: "Male",
    label: "Male"
  },
  {
    value: "Female",
    label: "Female"
  },
  {
    value: "Other",
    label: "Other"
  }
];

const optionsState = [
  // {
  //   value: 1,
  //   label: "上线中"
  // },
  {
    value: 2,
    label: "上线"
  },
  {
    value: 3,
    label: "下线"
  }
];

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

const handleClose = (params: DrawerProps) => {
  drawerVisible.value = false;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  drawerProps.value.row.name = drawerProps.value.row.ai_name;
  drawerProps.value.row.desc = drawerProps.value.row.ai_desc;
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}用户成功！` });
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
