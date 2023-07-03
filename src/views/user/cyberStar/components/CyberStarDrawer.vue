<template>
  <el-drawer v-model="showDrawer" :destroy-on-close="true" :show-close="false" size="760px">
    <h3>账号信息</h3>
    <el-form>
      <el-form-item label="用户账号：">
        <el-input :disabled="disabled" v-model="form.user_account" placeholder="用户账号：" />
      </el-form-item>
    </el-form>

    <h3>合作信息</h3>
    <el-form :inline="true" :rules="rules" :model="form" class="demo-form-inline" ref="ruleFormRef">
      <el-form-item label="网红姓名：" class="max-width">
        <el-input v-model="form.screen_name" placeholder="请输入网红姓名" />
      </el-form-item>
      <el-form-item label="合作信息备注：" class="max-width">
        <WangEditor v-model:value="form.coop_info" placeholder="请输入合作信息备注" height="300px" />
      </el-form-item>
      <el-form-item label="合同上传：" class="max-width">
        <UploadFile v-model:image-url="form.contract_file" v-model:file-url="form.contract_file"></UploadFile>
      </el-form-item>
      <el-form-item label="补充合同：" class="max-width">
        <UploadFile v-model:image-url="form.extra_contract_file" v-model:file-url="form.extra_contract_file"></UploadFile>
      </el-form-item>
      <br />
      <el-form-item label="开始时间：">
        <el-date-picker
          v-model="form.coop_stm"
          type="date"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间：">
        <el-date-picker
          v-model="form.coop_etm"
          type="date"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
    <h3>合作分成</h3>
    <el-form :inline="true" :rules="rules" class="demo-form-inline">
      <div class="form-list" v-for="(item, index) in form.diamond_ratios" :key="index">
        <el-form-item label="分成比例：" style="width: 300px">
          <el-input-number v-model="item.ratio" :min="0" :max="100" />
        </el-form-item>
        <el-text class="mx-1" v-if="form.diamond_ratios.length > 1" @click="delDiamondRatios(item)" type="danger">删除</el-text>
        <br />
        <el-form-item label="开始时间：">
          <el-date-picker
            v-model="item.stm"
            type="date"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：">
          <el-date-picker
            v-model="item.etm"
            type="date"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
      </div>
    </el-form>
    <el-button type="primary" @click="addDiamondRatios()">新增</el-button>
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
  extra_contract_file: "", // 补充合同
  coop_stm: "", // 合作开始时间, 使用 Y-m-d H:i:s格式
  coop_etm: "", //合作有效时间
  diamond_ratios: [
    {
      ratio: 0, //分成比例
      stm: "", // 生效开始日期
      etm: "" // 生效结束日期
    }
  ]
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

const delDiamondRatios = (item: any) => {
  form.value.diamond_ratios.splice(form.value.diamond_ratios.indexOf(item), 1);
};
const addDiamondRatios = () => {
  form.value.diamond_ratios.push({
    ratio: 0, //分成比例
    stm: "", // 生效开始日期
    etm: "" // 生效结束日期
  });
};

const initAdd = (params: any) => {
  showDrawer.value = true;
  disabled.value = false;
};

// 获取用户信息
const getInfo = (uid: string) => {
  getCyberStarInfo(uid).then(res => {
    if (res.code == "200") {
      const {
        real_name,
        alias,
        diamond_ratio,
        coop_info,
        contract_file,
        coop_stm,
        coop_etm,
        extra_contract_file,
        diamond_ratios
      } = res.data as any;
      form.value.real_name = real_name;
      form.value.screen_name = alias;
      form.value.coin2diamond = diamond_ratio;
      form.value.coop_info = coop_info;
      form.value.contract_file = contract_file;
      form.value.extra_contract_file = extra_contract_file;
      form.value.coop_stm = coop_stm;
      form.value.coop_etm = coop_etm;
      console.log("diamond_ratios", diamond_ratios);
      if (diamond_ratios.length > 0) {
        form.value.diamond_ratios = [];
      }
      diamond_ratios.forEach((element: { diamond_ratio: any; created_time: any; updated_time: any }) => {
        form.value.diamond_ratios.push({
          ratio: element.diamond_ratio, //分成比例
          stm: element.created_time, // 生效开始日期
          etm: element.updated_time // 生效结束日期
        });
      });
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
      console.log("form.value", form.value);
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
  form.value.extra_contract_file = "";
  form.value.coop_stm = "";
  form.value.coop_etm = "";
  disabled.value = true;
  form.value.diamond_ratios = [
    {
      ratio: 0,
      stm: "",
      etm: ""
    }
  ];
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
  padding: 0;
  padding-bottom: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--el-input-border-color, var(--el-border-color));
}
.demo-form-inline {
  width: 100%;
  .max-width {
    width: 100%;
  }
  .form-list {
    margin-bottom: 10px;
    border-bottom: 1px solid var(--el-input-border-color, var(--el-border-color));
    &:last-child {
      border-bottom: 0;
    }
    .mx-1 {
      display: inline-block;
      height: 32px !important;
      line-height: 32px;
      vertical-align: top;
      cursor: pointer;
    }
  }
}

// :deep(.el-picker__popper) {
//   transform: translateY(-140px);
// }
</style>
