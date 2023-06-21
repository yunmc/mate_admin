<template>
  <div class="card">
    <el-button type="primary" style="margin-bottom: 12px" icon="ArrowLeft" @click="goBack">返回</el-button>

    <table class="main-table">
      <tr class="table-header">
        <td>
          <h3>基本信息</h3>
        </td>
      </tr>
      <tr>
        <td class="td-baseinfo">
          <el-descriptions :column="3" style="width: 100%">
            <el-descriptions-item label="用户名：" width="33%">{{ userInfo.alias }}</el-descriptions-item>
            <el-descriptions-item label="用户账号：" width="33%">{{ userInfo.user_account }}</el-descriptions-item>
            <el-descriptions-item label="用户ID：" width="33%">{{ userInfo.uid }}</el-descriptions-item>
            <el-descriptions-item label="用户角色：" width="33%">{{ userInfo.role }}</el-descriptions-item>
            <el-descriptions-item label="用户状态：" width="33%">{{
              userInfo.is_deleted ? "已注销" : "正常"
            }}</el-descriptions-item>
            <el-descriptions-item label="虚拟人ID：" width="33%">{{ userInfo.ai_uid }}</el-descriptions-item>
          </el-descriptions>
        </td>
      </tr>
      <tr class="table-header">
        <td>
          <h3>账户信息</h3>
        </td>
      </tr>
      <tr>
        <td>
          <el-descriptions :column="3" style="width: 100%">
            <el-descriptions-item label="金币金额：" width="33%">{{ userInfo.coins_balance }}</el-descriptions-item>
            <el-descriptions-item label="钻石金额：" width="33%">{{ userInfo.diamond_balance }}</el-descriptions-item>
            <el-descriptions-item label="消费金币数：" width="33%">{{ userInfo.consume_points }}</el-descriptions-item>
            <el-descriptions-item label="累计获得钻石数：" width="33%">{{ userInfo.diamond_points }}</el-descriptions-item>
            <el-descriptions-item label="金币充值总数：" width="33%">{{ userInfo.recharge_points }}</el-descriptions-item>
            <el-descriptions-item label="被冻结钻石数：" width="33%">{{ userInfo.freeze_diamond_balance }}</el-descriptions-item>
          </el-descriptions>
        </td>
      </tr>
      <tr class="table-header">
        <td>
          <h3>合作信息</h3>
        </td>
      </tr>
      <tr>
        <td>
          <el-descriptions :column="3" style="width: 100%">
            <el-descriptions-item label="真实姓名：" width="33%">{{ userInfo.real_name }}</el-descriptions-item>
            <el-descriptions-item label="合作合同：" width="33%">
              <a :href="userInfo.contract_file" target="_blank">合作合同.PDF</a>
            </el-descriptions-item>
            <el-descriptions-item label="分成比例：" width="33%">{{ userInfo.diamond_ratio }}%</el-descriptions-item>
            <el-descriptions-item label="合作有效期：" :span="3">{{ userInfo.coop_etm }}</el-descriptions-item>
            <el-descriptions-item label="合作个人信息：" :span="3">{{ userInfo.coop_info }}</el-descriptions-item>
          </el-descriptions>
        </td>
      </tr>
      <tr class="table-header">
        <td>
          <h3>设备信息</h3>
        </td>
      </tr>
      <tr>
        <td>
          <el-descriptions :column="3" style="width: 100%">
            <el-descriptions-item label="注册IP：" width="33%">{{ userInfo.register_ip }}</el-descriptions-item>
            <el-descriptions-item label="IP属地：" width="33%">{{ userInfo.register_location }}</el-descriptions-item>
            <el-descriptions-item label="注册设备：" width="33%">暂无数据</el-descriptions-item>
            <el-descriptions-item label="最后一次登录IP：" width="33%">{{ userInfo.last_login_ip }}</el-descriptions-item>
            <el-descriptions-item label="最后一次登录IP属地：" width="33%">{{
              userInfo.last_login_location
            }}</el-descriptions-item>
            <el-descriptions-item label="最后一次登录设备" width="33%">暂无数据</el-descriptions-item>
          </el-descriptions>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx" name="cyberStarDetail">
import { useRouter, useRoute } from "vue-router";
import { getCyberStarInfo } from "@/api/user/cyberStar";
import { ref } from "vue";
const route = useRoute();
const router = useRouter();

const staffId = route.query.uid || "google_4423fd45d28c455a9498cec5b";

const userInfo = ref<{ [key: string]: any }>({});

// 获取用户信息
getCyberStarInfo(staffId as string).then(res => {
  if (res.code == "200") {
    userInfo.value = res.data as {};
  }
});

function goBack() {
  router.go(-1);
}
</script>
<style lang="scss" scoped>
a {
  color: #409eff;
}
.main-table {
  border-collapse: collapse;
  width: 100%;
  .table-header {
    background: #f7f7f7;
  }
  td {
    border: 1px solid #ebeef5;
    padding: 14px 16px;
  }
  tr {
    height: fit-content;
    min-height: 55px;
  }
}

h3 {
  font-size: 17px;
  margin: 0 60px 0 0;
}

.td-baseinfo {
  display: flex;
  align-items: center;
  .avatar {
    width: 100px;
    min-width: 100px;
    height: 100px;
    border-radius: 50%;
    display: block;
    object-fit: cover;
    margin-right: 30px;
  }
  tr:first-of-type {
    background: #dedfe0;
    td {
      background: #dedfe0 !important;
    }
  }
  :deep(.el-descriptions__label) {
    width: 15%;
  }
  :deep(.el-descriptions__content) {
    width: 35%;
  }
}
</style>
