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
        <el-button type="primary" icon="CirclePlus" @click="onAdd('添加剧本')"> 添加 </el-button>
      </template>

      <template #ai_name="scope">
        {{ scope.row.ai_name }}
      </template>
      <template #episode_sid="scope">
        {{ searchTitle(scope.row.episode_sid) }}
      </template>

      <template #tags="scope">
        <div style="white-space: initial">
          <el-tag class="mx-1" v-for="item in scope.row.tags" :key="item" style="margin: 2px 4px"> {{ item }} </el-tag>
        </div>
      </template>

      <template #prompt="scope">
        <el-button link @click="onEdit('编辑', scope.row)"> 编辑</el-button>
        <el-button link @click="onEdit('查看', scope.row)"> 查看 </el-button>
      </template>

      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link @click="onAdd('剧本配置', scope.row)"> 编辑 </el-button>
      </template>
    </ProTable>

    <PreviewImage ref="previewRef" />

    <!-- 编辑抽屉 -->
    <VirtualHumanDrawer ref="drawerRef" />

    <Drawer ref="drawer2Ref"></Drawer>
  </div>
</template>

<script setup lang="tsx" name="useInfo">
import { ref, reactive } from "vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";

import VirtualHumanDrawer from "./components/VirtualHumanDrawer.vue";
import Drawer from "./components/detail.vue";
import PreviewImage from "@/views/proTable/components/PreviewImage.vue";
import { getEpisodeList, saveEpisode, seasonList } from "@/api/playConfig/play";
import { deepClone } from "@/utils/index";
import { getPicList } from "@/api/gallery";
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
  console.log("option", option);
  const params = {
    page: option.page,
    pageSize: option.pageSize,
    ai_uid: option.ai_name
  };
  return getEpisodeList(params);
};

// 上线状态 字典
const getOnlineStatus = () => {
  return [
    // { stateLabel: "初始化", stateValue: 1 },
    { stateLabel: "上线", stateValue: 1 },
    { stateLabel: "下线", stateValue: 0 }
  ];
};

// 公开状态 字典
const getOpenStatus = () => {
  return [
    { stateLabel: "私密", stateValue: 1 },
    { stateLabel: "公开", stateValue: 2 }
  ];
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
// const { BUTTONS } = useAuthButtons();
// 表格配置项
const columns: ColumnProps[] = [
  {
    prop: "ai_name",
    label: "AI昵称",
    width: "120",
    enum: () => getPicList({ page: 1, pageSize: 1, search: true }),
    search: { el: "select", props: { filterable: true } },
    fieldNames: { label: "ai_name", value: "ai_uid" }
  },
  {
    prop: "episode_ai_uid",
    label: "AI_id"
  },
  {
    prop: "episode_sid",
    label: "章节"
  },
  {
    prop: "episode_title",
    label: "关卡名"
  },
  {
    prop: "episode_sort",
    label: "关卡排序"
  },
  {
    prop: "episode_thumbnail",
    label: "图片(缩略图)",
    width: "100",
    render: scope => {
      return (
        <el-image
          style="z-index:100;width:80px;height:80px;cursor: pointer;"
          src={scope.row.episode_thumbnail}
          onClick={() => showImages(scope.row, 8)}
        ></el-image>
      );
    }
  },
  {
    prop: "prompt",
    label: "Prompt设置"
  },
  {
    prop: "episode_online_state",
    label: "上线状态",
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
    api: saveEpisode,
    getTableList: proTable.value?.getTableList
  };
  const params2 = deepClone(params);
  params2.api = saveEpisode;
  params2.getTableList = proTable.value?.getTableList;
  params2.row.loraList = loraList.value;
  console.log("params2", params2);
  drawerRef.value?.acceptParams(params2);
};

const previewRef = ref<InstanceType<typeof PreviewImage> | null>(null);
//预览图片
const showImages = (row: any, index: number) => {
  const params = {
    index: index,
    row: { ...row }
  };
  previewRef.value?.previewParams(params);
};

const drawer2Ref = ref<InstanceType<typeof Drawer> | null>(null);

//编辑
const onEdit = (title: string, row?: {}) => {
  const params = {
    title,
    isView: title === "编辑" ? false : true,
    row: { ...row },
    api: saveEpisode,
    getTableList: proTable.value?.getTableList
  };
  const params2 = deepClone(params);
  drawer2Ref.value?.acceptParams(params);
};

const loraList = ref([]);

const getLoraListApi = () => {
  const params = {
    page: 1,
    pageSize: 1000
  };
  seasonList(params).then((res: any) => {
    if (res.code == 200) {
      loraList.value = res.data.list.reverse();
    }
  });
};
getLoraListApi();

const searchTitle = (id: any) => {
  const items: any = loraList.value.find(function (item: any) {
    return item.id == id;
  });
  if (items) {
    return items.season_title;
  }
};
</script>
