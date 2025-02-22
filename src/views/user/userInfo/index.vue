<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="用户列表"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link @click="goDetail(scope.row)"> 查看详情 </el-button>
      </template>
    </ProTable>
    <PreviewImage ref="previewRef" />
  </div>
</template>

<script setup lang="tsx" name="useInfo">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";

import { getUserList } from "@/api/user/index";

const router = useRouter();

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && page && pageSize 这些字段，那么你可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    page: data.page,
    pageSize: data.pageSize
  };
};

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (option: any) => {
  const params = {
    page: option.page,
    pageSize: option.pageSize,
    search: option.search,
    coinSearch: option.coinSearch
  };
  return getUserList(params);
};

const getStateStatus = () => {
  return [
    { stateLabel: "正常", stateValue: 1 },
    { stateLabel: "已注销", stateValue: 2 },
    { stateLabel: "封禁", stateValue: 3 }
  ];
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
// const { BUTTONS } = useAuthButtons();

// 表格配置项
const columns: ColumnProps[] = [
  {
    prop: "user_account",
    label: "用户账号",
    search: { el: "input", key: "search", label: "用户账号/用户ID" }
  },
  {
    prop: "uid",
    label: "用户ID"
  },
  {
    prop: "alias",
    label: "用户名"
  },
  {
    prop: "role",
    label: "角色"
  },
  {
    prop: "coins_balance",
    label: "金币余额",
    search: { el: "input", key: "coinSearch", label: "按账户金币/余额查询" }
  },
  {
    prop: "diamond_balance",
    label: "钻石余额"
  },
  {
    prop: "diamond_points",
    label: "累计钻石数"
  },
  {
    prop: "last_active_time",
    label: "最后一次登录时间"
  },
  {
    prop: "user_state",
    label: "状态",
    enum: getStateStatus(),
    fieldNames: { label: "stateLabel", value: "stateValue" }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 100 }
];

//查看详情
const goDetail = (row: { uid: string }) => {
  router.push("/user/user-info/detail?uid=" + row.uid);
};
</script>
