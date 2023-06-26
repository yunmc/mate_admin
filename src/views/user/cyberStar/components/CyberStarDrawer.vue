<template>
  <el-drawer v-model="showDrawer" :destroy-on-close="true" :show-close="false" size="760px">
    <h3>账户信息</h3>
    <el-form>
      <el-form-item label="用户账号：">
        <el-input :disabled="disabled" v-model="form.user_account" placeholder="用户账号：" />
      </el-form-item>
    </el-form>

    <h3>合作信息</h3>
    <el-form :inline="true" :rules="rules" :model="form" class="demo-form-inline" ref="ruleFormRef">
      <el-form-item label="真实姓名：">
        <el-input v-model="form.real_name" placeholder="请输入真实姓名" />
      </el-form-item>
      <el-form-item label="社交媒体网名：">
        <el-input v-model="form.screen_name" placeholder="请输入社交媒体网名" />
      </el-form-item>
      <el-form-item label="分成比例：">
        <el-input v-model="form.coin2diamond" placeholder="请输入整数单位为%" />
      </el-form-item>
      <el-form-item label="合作有效期：">
        <el-date-picker
          type="datetimerange"
          v-model="timeRanges"
          :teleported="false"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          align="right"
          @change="changeDatePicker"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="合作个人信息：">
        <WangEditor v-model:value="form.coop_info" height="300px" />
        <!-- <el-input type="textarea" v-model="form.coop_info" placeholder="请输入合作个人信息" /> -->
      </el-form-item>
      <el-form-item label="合同上传：">
        <UploadFile v-model:image-url="form.contract_file" v-model:file-url="form.contract_file"></UploadFile>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="showDrawer = false"> 取消 </el-button>
      <el-button type="primary" @click="handelEdit"> 确认 </el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { ElMessage, FormInstance } from "element-plus";
import UploadFile from "@/components/Upload/File.vue";
import WangEditor from "@/components/WangEditor/index.vue";

import { postCyberStarInfo, getCyberStarInfo } from "@/api/user/cyberStar";

const route = useRoute();

const showDrawer = ref(false);
const disabled = ref(true);
const form = ref({
  user_account: "", // 用户账号
  real_name: "", // 真实姓名
  screen_name: "", // 网名
  coin2diamond: "", // 金币与钻石收益兑换比
  coop_info: "", // 合作信息, 建议使用富文本
  contract_file: "", // 合同文件地址, 上传后会返回
  coop_stm: "", // 合作开始时间, 使用 Y-m-d H:i:s格式
  coop_etm: "" //合作有效时间
});

const rules = reactive({
  user_account: [{ required: true, message: "请输入用户账号" }]
});

interface DrawerProps {
  getTableList?: () => void;
}
// 父组件传过来的值
const drawerProps = ref<DrawerProps>({
  getTableList: () => {}
});

// 初始化对话框;
const initDrawer = (params: any) => {
  const { row, getTableList } = params;
  console.log(row, getTableList);
  form.value.user_account = row.user_account;
  getInfo(row.uid);
  drawerProps.value.getTableList = getTableList;
  showDrawer.value = true;
};

const initAdd = (params: any) => {
  showDrawer.value = true;
  disabled.value = false;
};

// 获取用户信息
const getInfo = (uid: string) => {
  getCyberStarInfo(uid).then(res => {
    if (res.code == "200") {
      const { real_name, alias, diamond_ratio, coop_info, contract_file, coop_stm, coop_etm } = res.data as any;
      form.value.real_name = real_name;
      form.value.screen_name = alias;
      form.value.coin2diamond = diamond_ratio;
      form.value.coop_info = coop_info;
      form.value.contract_file = contract_file;
      form.value.coop_stm = coop_stm;
      form.value.coop_etm = coop_etm;
      timeRanges.value = [coop_stm, coop_etm];
    }
  });
};

//时间范围
const timeRanges = ref<[Date, Date]>([new Date(), new Date()]);
const changeDatePicker = (value: string[]) => {
  form.value.coop_stm = value[0];
  form.value.coop_etm = value[1];
};

const ruleFormRef = ref<FormInstance>();
//确认编辑
const handelEdit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      const res = await postCyberStarInfo(form.value);
      if (res.code == "200") {
        if (disabled.value) {
          ElMessage.success({ message: "编辑成功" });
        } else {
          ElMessage.success({ message: "添加成功" });
        }
        drawerProps.value.getTableList!();
        showDrawer.value = false;
      } else {
        ElMessage.warning({ message: res.msg });
      }
    } catch (error) {
      console.error(error);
    }
  });
};

//关闭前清空表单
const handlerBeforeClose = () => {
  form.value.user_account = "";
  form.value.real_name = "";
  form.value.screen_name = "";
  form.value.coin2diamond = "";
  form.value.coop_info = "";
  form.value.contract_file = "";
  form.value.coop_stm = "";
  form.value.coop_etm = "";
  disabled.value = true;
  timeRanges.value = [new Date(), new Date()];
};
watchEffect(() => {
  if (!showDrawer.value) handlerBeforeClose();
});

defineExpose({
  initDrawer,
  initAdd
});
</script>

<style lang="scss" scoped>
h3 {
  display: block;
  width: 100%;
  padding: 12px 25px;
  background: #dedfe0;
}
:deep(.el-picker__popper) {
  transform: translateY(-140px);
}
</style>
