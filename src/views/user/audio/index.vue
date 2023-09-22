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
      <template #soure="scope">
        <audio controls :src="scope.row!.source_url"></audio>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)"> 编辑 </el-button>
        <el-popconfirm
          width="220"
          @confirm="deleteAccount(scope.row)"
          confirm-button-text="确定"
          cancel-button-text="取消"
          icon-color="#626AEF"
          title="确定要删除?"
        >
          <template #reference>
            <el-button type="primary" link :icon="Delete"> 删除 </el-button>
          </template>
        </el-popconfirm>
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />
    <!-- <PreviewImage ref="previewRef" /> -->
    <!-- <ImportExcel ref="dialogRef" /> -->

    <!-- <div class="el-image-viewer__mask" v-if="previewList">
      <el-image style="width: 100px; height: 100px" :initial-index="imageIndex" :preview-src-list="previewList"> </el-image>
    </div> -->
  </div>
</template>

<script setup lang="tsx" name="userAudio">
import { ref, reactive } from "vue";
// import { App } from "@/api/interface";
// import { useHandleData } from "@/hooks/useHandleData";
// import { useDownload } from "@/hooks/useDownload";
// import { useAuthButtons } from "@/hooks/useAuthButtons";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
// import ImportExcel from "@/components/ImportExcel/index.vue";
import UserDrawer from "./compoments/index.vue";
// import PreviewImage from "@/views/proTable/components/PreviewImage.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, EditPen, Delete } from "@element-plus/icons-vue";
import { getVoiceList, setVoiceSave, App, setVoiceDel } from "@/api/user/audio";
import { deepClone } from "@/utils/index";
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

  return getVoiceList();
};

const getStateStatus = () => {
  return [
    { stateLabel: "否", stateValue: 0 },
    { stateLabel: "是", stateValue: 1 }
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
    prop: "voice_title",
    label: "音频名称"
  },
  {
    prop: "soure",
    label: "音频"
  },
  {
    prop: "voice_id",
    label: "声音ID"
  },
  {
    prop: "weight",
    label: "排序"
  },
  {
    prop: "is_vip",
    enum: getStateStatus(),
    fieldNames: { label: "stateLabel", value: "stateValue" },
    label: "是否会员"
  },
  { prop: "operation", label: "操作", fixed: "right", width: 160 }
];

// const previewRef = ref<InstanceType<typeof PreviewImage> | null>(null);
const deleteAccount = (row: Partial<App.ResConfig>) => {
  setVoiceDel({ id: row.id }).then(res => {
    proTable.value?.getTableList();
  });
};
const data: Partial<App.ResConfig> = {
  voice_id: "", // 音频id
  source_url: "", // 音频url
  weight: "", // 最新版本
  is_vip: "1" // 更新类型
};
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<App.ResConfig> = {}) => {
  let par = deepClone(row);
  par.is_vip = String(par.is_vip);
  const params = {
    title,
    isView: title === "新增",
    row: { ...par },
    api: title === "新增" ? setVoiceSave : title === "编辑" ? setVoiceSave : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
<style scoped lang="scss">
audio {
  width: 100%;
}
</style>
