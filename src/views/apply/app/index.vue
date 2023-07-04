<template>
  <div class="table-box">
    <ProTable ref="proTable" title="用户列表" :columns="columns" :request-api="getTableList" :data-callback="dataCallback">
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <!-- 表格操作 -->
      <template #notes="scope">
        <el-switch
          v-if="scope.row.check_state == 1"
          :value="scope.row.mark_state == 2 ? true : false"
          @change="maskState(scope.row)"
          active-color="#13ce66"
        >
        </el-switch>
      </template>
      <template #operation="scope">
        <el-popconfirm v-if="scope.row.check_state == 1" title="确定用户通过?" @confirm="passApply({ id: scope.row.id })">
          <template #reference>
            <el-button type="text">通过</el-button>
          </template>
        </el-popconfirm>
        <el-popconfirm v-if="scope.row.check_state == 1" title="确定不通过?" @confirm="rejectApply({ id: scope.row.id })">
          <template #reference>
            <el-button type="text" style="color: #f56c6c">不通过</el-button>
          </template>
        </el-popconfirm>
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />
    <PreviewImage ref="previewRef" />
    <!-- <ImportExcel ref="dialogRef" /> -->

    <!-- <div class="el-image-viewer__mask" v-if="previewList">
      <el-image style="width: 100px; height: 100px" :initial-index="imageIndex" :preview-src-list="previewList"> </el-image>
    </div> -->
  </div>
</template>

<script setup lang="tsx" name="liveApply">
import { ref, reactive } from "vue";
import { User } from "@/api/interface";
import ProTable from "@/components/ProTable/index.vue";
import UserDrawer from "@/views/proTable/components/UserDrawer.vue";
import PreviewImage from "@/views/proTable/components/PreviewImage.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { getAppList, markAppApply, passApply, rejectApply } from "@/api/apply";

// const router = useRouter();

// 跳转详情页
// const toDetail = () => {
//   router.push(`/proTable/useProTable/detail/${Math.random().toFixed(3)}?params=detail-page`);
// };

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
// const initParam = reactive({ mark_state: 1 });

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
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  if (newParams.created_time) {
    newParams.s_date = newParams.created_time[0];
    newParams.e_date = newParams.created_time[1];
  }
  delete newParams.created_time;
  console.log("params", newParams);

  return getAppList(newParams);
};

const maskState = async (params: any) => {
  await markAppApply({ id: params.id });
  params.mark_state = params.mark_state == 1 ? 2 : 1;
};

// 上线状态
const getOnlineStatus = () => {
  return [
    { stateLabel: "待审核", stateValue: 1 },
    { stateLabel: "通过", stateValue: 2 },
    { stateLabel: "不通过", stateValue: 3 }
  ];
};

// 表格配置项
const columns: ColumnProps<User.ResUserList>[] = [
  { type: "index", label: "#", width: 80 },
  {
    prop: "user_account",
    label: "用户账号"
  },
  {
    prop: "alias",
    label: "用户名",
    search: { el: "input", key: "alias" }
  },
  {
    prop: "screen_name",
    label: "社交媒体名称"
  },
  {
    prop: "email",
    label: "邮箱"
  },
  {
    prop: "advantage",
    label: "申请消息"
  },
  {
    prop: "created_time",
    label: "投递时间",
    search: {
      el: "date-picker",
      span: 1,
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" }
      // defaultValue: ["2022-11-12 11:35:00", "2022-12-12 11:35:00"]
    }
  },
  {
    prop: "check_state",
    label: "状态",
    search: {
      el: "select",
      key: "check_state",
      defaultValue: 1
    },
    enum: getOnlineStatus(),
    fieldNames: { label: "stateLabel", value: "stateValue" }
  },
  {
    prop: "notes",
    label: "备注",
    fixed: "right",
    width: 160
  },
  {
    prop: "operation",
    label: "操作",
    fixed: "right",
    width: 160
  }
];

const previewRef = ref<InstanceType<typeof PreviewImage> | null>(null);
// const imageIndex = ref(0);
const showImages = (row: User.ResUserList, index: number) => {
  const params = {
    index: index,
    row: { ...row }
  };
  previewRef.value?.previewParams(params);
};

// // 导出用户列表
// const downloadFile = async () => {
//   ElMessageBox.confirm("确认导出用户数据?", "温馨提示", { type: "warning" }).then(() =>
//     useDownload(exportUserInfo, "用户列表", proTable.value?.searchParam)
//   );
// };

// // 批量添加用户
// const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
// const batchAdd = () => {
//   const params = {
//     title: "用户",
//     tempApi: exportUserInfo,
//     importApi: BatchAddUser,
//     getTableList: proTable.value?.getTableList
//   };
//   dialogRef.value?.acceptParams(params);
// };
</script>
