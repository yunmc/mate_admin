<template>
  <div class="chapter">
    <h3>创建章节</h3>
    <p>章节将作为标题展示在AI剧本功能中，请先创建章节再添加关卡</p>
    <s></s>
  </div>
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
        <el-button type="primary" icon="CirclePlus" @click="onAdd('添加章节')"> 添加 </el-button>
      </template>

      <template #ai_name="scope">
        {{ scope.row.ai_name }}
      </template>

      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link @click="delModel(scope.row)"> 删除 </el-button>
      </template>
    </ProTable>

    <!-- 编辑抽屉 -->
    <VirtualHumanDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="useInfo">
import { ref, reactive } from "vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";

import VirtualHumanDrawer from "./components/VirtualHumanDrawer.vue";
import { seasonList, saveSeason, delSeason } from "@/api/playConfig/play";
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

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getEpisodeList"
const getTableList = (option: any) => {
  console.log("option", option);
  const params = {
    page: option.page,
    pageSize: option.pageSize,
    ai_uid: option.ai_name
  };
  return seasonList(params);
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
// const { BUTTONS } = useAuthButtons();

// 表格配置项
const columns: ColumnProps[] = [
  {
    prop: "season_title",
    label: "章节名称"
  },
  {
    prop: "season_sort",
    label: "排序"
  },
  {
    prop: "ai_name",
    label: "绑定AI",
    enum: () => getPicList({ page: 1, pageSize: 1, search: true }),
    search: { el: "select", props: { filterable: true } },
    fieldNames: { label: "ai_name", value: "ai_uid" }
  },
  { prop: "operation", label: "操作", fixed: "right" }
];

const drawerRef = ref<InstanceType<typeof VirtualHumanDrawer> | null>(null);
//添加
const onAdd = (title: string, row?: {}) => {
  const params = {
    title,
    isView: title === "添加章节",
    row: { ...row },
    api: saveSeason,
    getTableList: proTable.value?.getTableList
  };
  const params2 = deepClone(params);
  params2.api = saveSeason;
  params2.getTableList = proTable.value?.getTableList;
  drawerRef.value?.acceptParams(params2);
};
//删除
const delModel = (item: any) => {
  delSeason({ id: item.id }).then((res: any) => {
    if (res.code == 200) {
      proTable.value?.getTableList();
    }
  });
};
</script>
<style scoped lang="scss">
.chapter {
  position: relative;
  padding: 10px;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  box-shadow: 0 0 12px rgb(0 0 0 / 5%);
  h3 {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: bold;
  }
  p {
    font-size: 14px;
  }
  s {
    position: absolute;
    bottom: -8px;
    left: 0;
    display: block;
    width: 100%;
    height: 10px;
    background: #ffffff;
  }
}
</style>
