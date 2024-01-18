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
        <el-button type="primary" icon="CirclePlus" @click="onAdd('添加')"> 添加 </el-button>
      </template>

      <template #start_time="scope">
        {{ dayjs.unix(scope.row.start_time).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
      <template #end_time="scope">
        {{ dayjs.unix(scope.row.end_time).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link @click="onAdd('编辑', scope.row)"> 编辑 </el-button>
        <el-popconfirm
          width="220"
          confirm-button-text="确认下线"
          cancel-button-text="取消"
          :icon="InfoFilled"
          icon-color="#626AEF"
          title="确认要下线?"
          v-if="scope.row.activity_status == 1"
          @confirm="activityUpdate(scope.row)"
        >
          <template #reference>
            <el-button type="primary" link> 下线 </el-button>
          </template>
        </el-popconfirm>
        <el-popconfirm
          width="220"
          confirm-button-text="确认上线"
          cancel-button-text="取消"
          :icon="InfoFilled"
          icon-color="#626AEF"
          title="确认要上线?"
          v-else
          @confirm="activityUpdate(scope.row)"
        >
          <template #reference>
            <el-button type="primary" link> 上线 </el-button>
          </template>
        </el-popconfirm>
        <el-popconfirm
          width="220"
          confirm-button-text="确认删除"
          cancel-button-text="取消"
          :icon="InfoFilled"
          icon-color="#F56C6C"
          title="确认要删除?"
          @confirm="activityDel(scope.row)"
        >
          <template #reference>
            <el-button type="primary" link v-if="scope.row.activity_status == 2"> 删除 </el-button>
          </template>
        </el-popconfirm>
      </template>
    </ProTable>

    <PreviewImage ref="previewRef" />

    <!-- 编辑抽屉 -->
    <VirtualHumanDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="useInfo">
import { ref, reactive } from "vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import VirtualHumanDrawer from "./components/VirtualHumanDrawer.vue";
import PreviewImage from "@/views/proTable/components/PreviewImage.vue";
import { getActivityList, getActivityUpdate, getActivitySave, deleteActivity } from "@/api/app/index";
import { deepClone } from "@/utils/index";
import { InfoFilled } from "@element-plus/icons-vue";
import dayjs from "dayjs";
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

const generate_photo_model = ref();
const ai_classes = ref();
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getEpisodeList"
const getTableList = (option: any) => {
  const params = {
    page: option.page,
    page_size: option.pageSize,
    id: "",
    activity_channel: "",
    activity_platform: option.activity_platform,
    activity_target: option.activity_target,
    activity_status: option.activity_status
  };
  return getActivityList(params);
};

// 上线 下线
const activityUpdate = async (item: any) => {
  const params = deepClone(item);
  params.activity_status = params.activity_status == 1 ? 2 : 1;
  let data: any = await getActivityUpdate(params);
  if (data.code == 200) {
    item.activity_status = item.activity_status == 1 ? 2 : 1;
  }
  proTable.value?.reset;
};

const activityDel = async (item: any) => {
  const params = {
    id: item.id
  };
  let data: any = await deleteActivity(params);
  if (data.code == 200) {
    proTable.value?.getTableList();
  }
};
// 上线状态 字典
const getOnlineStatus = () => {
  return [
    { stateLabel: "上线", stateValue: 1 },
    { stateLabel: "下线", stateValue: 2 }
  ];
};

// 用户 字典
const getTargetStatus = () => {
  return [
    { stateLabel: "所有用户", stateValue: 1 },
    { stateLabel: "新注册（注册24h）", stateValue: 2 },
    { stateLabel: "老用户", stateValue: 3 },
    { stateLabel: "未订阅", stateValue: 4 }
  ];
};

const getPlatformStatus = () => {
  return [
    { stateLabel: "所有客户端通用", stateValue: 1 },
    { stateLabel: "iOS专属", stateValue: 2 },
    { stateLabel: "Android专属", stateValue: 3 },
    { stateLabel: "h5专属", stateValue: 4 }
  ];
};

// 排序 字典
const getSortStatus = () => {
  return [
    { stateLabel: "正序", stateValue: 1 },
    { stateLabel: "倒序", stateValue: 2 }
  ];
};

// 表格配置项
const columns: ColumnProps[] = [
  {
    prop: "banner_url",
    label: "活动图地址",
    width: "100",
    render: scope => {
      return (
        <el-image
          style="z-index:100;width:80px;height:80px;cursor: pointer;"
          src={scope.row.banner_url}
          onClick={() => showImages(scope.row.banner_url, 0)}
        ></el-image>
      );
    }
  },
  {
    prop: "activity_title",
    label: "活动名称（暂时不对用户展示）"
  },
  {
    prop: "activity_scheme",
    label: "跳转路径"
  },
  {
    prop: "activity_target",
    label: "作用范围",
    search: { el: "tree-select", props: { filterable: true }, key: "activity_target" },
    enum: getTargetStatus(),
    fieldNames: { label: "stateLabel", value: "stateValue" }
  },
  {
    prop: "activity_platform",
    label: "活动平台",
    search: { el: "tree-select", props: { filterable: true }, key: "activity_platform" },
    enum: getPlatformStatus(),
    fieldNames: { label: "stateLabel", value: "stateValue" }
  },
  {
    prop: "activity_weight",
    label: "排序",
    sortable: true
  },
  {
    prop: "start_time",
    label: "上线时间"
  },
  {
    prop: "end_time",
    label: "下线时间"
  },
  {
    prop: "updated_time",
    label: "最后更新时间"
  },
  {
    prop: "activity_status",
    label: "上线状态",
    search: { el: "tree-select", props: { filterable: true }, key: "activity_status" },
    enum: getOnlineStatus(),
    fieldNames: { label: "stateLabel", value: "stateValue" }
  },
  { prop: "operation", label: "操作", fixed: "right" }
];

const drawerRef = ref<InstanceType<typeof VirtualHumanDrawer> | null>(null);
//添加
const onAdd = (title: string, row?: {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "添加" ? getActivitySave : getActivityUpdate,
    getTableList: proTable.value?.getTableList,
    getTargetStatus: getTargetStatus(),
    getPlatformStatus: getPlatformStatus()
  };
  drawerRef.value?.acceptParams(params);
};

const previewRef = ref<InstanceType<typeof PreviewImage> | null>(null);
//预览图片
const showImages = (row: any, index: number) => {
  const params = {
    index: index,
    row: row
  };
  previewRef.value?.previewParams(params);
};
</script>
