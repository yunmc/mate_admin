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
      <!-- 表格 header 按钮 -->
      <template #tableHeader="">
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增', data)"> 添加 </el-button>
      </template>

      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <!-- usernameHeader -->
      <template #usernameHeader="scope">
        <el-button type="primary" @click="ElMessage.success('我是通过作用域插槽渲染的表头')">
          {{ scope.column.label }}
        </el-button>
      </template>
      <!-- createTime -->
      <template #createTime="scope">
        <el-button type="primary" link @click="ElMessage.success('我是通过作用域插槽渲染的内容')">
          {{ scope.row.createTime }}
        </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)"> 编辑 </el-button>
        <!-- <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)"> 下线 </el-button> -->
        <!-- <el-button type="primary" link :icon="Refresh" @click="resetPass(scope.row)"> 重置密码 </el-button> -->
        <!-- <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)"> 删除 </el-button> -->
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

<script setup lang="tsx" name="updata">
import { ref, reactive } from "vue";
import { App } from "@/api/interface";
// import { useHandleData } from "@/hooks/useHandleData";
// import { useDownload } from "@/hooks/useDownload";
// import { useAuthButtons } from "@/hooks/useAuthButtons";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
// import ImportExcel from "@/components/ImportExcel/index.vue";
import UserDrawer from "@/views/proTable/components/appSetVersion.vue";
import PreviewImage from "@/views/proTable/components/PreviewImage.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, EditPen, View } from "@element-plus/icons-vue";
import { editUser } from "@/api/modules/user";
import { getUpgradeVersion, saveUpgradeVersion } from "@/api/app";

// const router = useRouter();

// 跳转详情页
// const toDetail = () => {
//   router.push(`/proTable/useProTable/detail/${Math.random().toFixed(3)}?params=detail-page`);
// };

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ type: 1 });

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && page && pageSize 这些字段，那么你可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  console.log("data", data);
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
  let newParams: any = JSON.parse(JSON.stringify(params));
  // newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  // newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  console.log("params", newParams);

  return getUpgradeVersion();
};

const getStateStatus = () => {
  return [
    // { stateLabel: "初始化", stateValue: 1 },
    { stateLabel: "推荐更新", stateValue: "1" },
    { stateLabel: "强制更新", stateValue: "2" }
  ];
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
// const { BUTTONS } = useAuthButtons();

// 表格配置项
const columns: ColumnProps<App.ResConfig>[] = [
  // { type: "selection", fixed: "left", width: 80 },
  { type: "index", label: "#", width: 80 },
  // { type: "expand", label: "Expand", width: 100 },
  {
    prop: "client_type",
    label: "类型"
  },
  {
    prop: "upgrade_version",
    label: "最新版本号"
  },
  {
    prop: "upgrade_content",
    label: "更新内容"
  },
  {
    prop: "upgrade_type",
    enum: getStateStatus(),
    fieldNames: { label: "stateLabel", value: "stateValue" },
    label: "更新方式"
  },
  {
    prop: "created_time",
    label: "操作时间"
  },
  { prop: "operation", label: "操作", fixed: "right", width: 160 }
];

const previewRef = ref<InstanceType<typeof PreviewImage> | null>(null);

const data: Partial<App.ResConfig> = {
  client_type: "ios", // 客户端类型
  upgrade_content: "", // 更新信息
  upgrade_version: "", // 最新版本
  upgrade_type: "1" // 更新类型
};
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<App.ResConfig> = {}) => {
  console.log("row", row);
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? saveUpgradeVersion : title === "编辑" ? saveUpgradeVersion : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
