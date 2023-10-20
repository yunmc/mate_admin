<template>
  <div class="recharge">
    <el-dialog v-model="drawerVisible" title="添加" width="38%" @before-close="handleClose">
      <el-form
        ref="ruleFormRef"
        label-width="170px"
        label-suffix=" :"
        :rules="rules"
        :disabled="drawerProps.isView"
        :model="drawerProps.row"
        :hide-required-asterisk="drawerProps.isView"
      >
        <el-form-item label="版本类型" prop="recharge_type">
          <el-select style="width: 100%" v-model="drawerProps.row!.recharge_type" class="m-2" placeholder="Select">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="数量" prop="amount">
          <el-input v-model="drawerProps.row!.amount" placeholder="请输入数量" min="1" max="5" clearable></el-input>
          <p class="tips" v-if="drawerProps.row!.recharge_type == 0">*单次充值MateCoins数量最大上限为<span>1000</span></p>
          <p class="tips" v-else><span>*最小数量为1，最大为12</span></p>
        </el-form-item>

        <el-form-item label="充值账号" prop="user_account">
          <el-input v-model="drawerProps.row!.user_account" placeholder="请输入账号" clearable></el-input>
        </el-form-item>

        <el-form-item label="用途备注：" prop="remark">
          <el-input
            v-model="drawerProps.row!.remark"
            :rows="3"
            maxlength="200"
            type="textarea"
            placeholder="必要时请备注使用人姓名、用途，以便溯源"
          />
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

const rules = reactive({
  // user_account: [{ required: true, message: "请输入充值账号" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<App.ResConfig>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const options = [
  {
    value: "0",
    label: "MateCoins"
  },
  {
    value: "1",
    label: "Pro会员"
  }
];
const optionsState = [
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
  if (drawerProps.value.row.amount == "" || drawerProps.value.row.amount == 0) {
    ElMessage.error("请输入数量");
    return false;
  }
  if (drawerProps.value.row.recharge_type == 0) {
    if (drawerProps.value.row.amount > 1000) {
      ElMessage.error("单次充值MateCoins数量最大上限为1000");
      return false;
    }
  } else {
    if (drawerProps.value.row.amount > 12) {
      ElMessage.error("最小数量为1，最大为12");
      return false;
    }
  }
  if (drawerProps.value.row.user_account == "") {
    ElMessage.error("请输入充值账号");
    return false;
  }
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}版本成功！` });
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
.recharge {
  .el-form-item__label {
    width: 90px;
    margin-right: 10px;
  }
  .tips {
    height: 20px;
    padding: 0;
    margin: 0;
    font-size: 12px;
    span {
      color: #f00b0b;
    }
  }
}
</style>
