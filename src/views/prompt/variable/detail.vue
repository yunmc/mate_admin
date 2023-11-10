<template>
  <div class="setViersion">
    <el-dialog v-model="drawerVisible" title="添加自定义变量" width="35%" @before-close="handleClose">
      <div class="tips">
        自定义变量为创建Prompt模板中的可变量，在创建模板时，需优先添加会用到的自定义变量。
        变量只能由字母、数字和"_"组成，不能以数字开头。
      </div>
      <el-form
        ref="ruleFormRef"
        label-width="120px"
        label-suffix=" :"
        :rules="rules"
        :disabled="drawerProps.isView"
        :model="drawerProps.row"
        :hide-required-asterisk="drawerProps.isView"
      >
        <el-form-item label="变量英文名" prop="variable_name">
          <el-input v-model="drawerProps.row!.variable_name" maxlength="30" placeholder="请输入变量英文名" clearable></el-input>
        </el-form-item>
        <el-form-item label="变量中文名" prop="variable_cname">
          <el-input v-model="drawerProps.row!.variable_cname" maxlength="30" placeholder="请输入变量中文名" clearable></el-input>
        </el-form-item>
        <el-form-item label="数据类型" prop="variable_type">
          <el-select style="width: 100%" v-model="drawerProps.row!.variable_type" class="m-2" placeholder="Select">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="drawerProps.row!.remark" :rows="3" maxlength="100" type="textarea" placeholder="请输入备注" />
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

<script setup lang="ts" name="variable">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ref, reactive } from "vue";
// import { genderType } from "@/utils/serviceDict";
import { ElMessage, FormInstance } from "element-plus";
// import WangEditor from "@/components/WangEditor/index.vue";
import { variableType } from "@/api/prompt";
import { isModelType } from "@/utils/index";
const rules = reactive({
  variable_name: [{ required: true, message: "请输入变量英文名" }],
  variable_cname: [{ required: true, message: "请输入变量中文名" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<variableType>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const options = [
  {
    value: "STRING",
    label: "STRING"
  },
  {
    value: "NUMBER",
    label: "NUMBER"
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
  if (
    drawerProps.value.row.variable_name.length > 30 ||
    drawerProps.value.row.variable_name.length < 3 ||
    !isModelType(drawerProps.value.row.variable_name)
  ) {
    ElMessage.error("ID必须由字母开头的字母/数组/下划线的3-30位组合");
    return false;
  }
  console.log("drawerProps.value", drawerProps.value.row);
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}变量成功！` });
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
<style lang="scss" scoped>
.setViersion {
  .el-form-item__label {
    width: 90px;
    margin-right: 10px;
  }
  .tips {
    padding: 0 25px;
    margin-bottom: 20px;
    color: #938d8d;
  }
}
</style>
