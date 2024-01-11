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
        <el-button type="primary" icon="CirclePlus" @click="onAdd('虚拟人添加')"> 添加 </el-button>
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
        <el-button type="primary" link @click="onAdd('虚拟人编辑', scope.row)"> 编辑 </el-button>
        <el-button type="primary" link @click="onAdd('虚拟人详情', scope.row)"> 查看 </el-button>
        <el-button type="primary" link v-if="[2, 3].includes(scope.row.ai_state)" @click="onChangeStatus(scope.row.ai_uid)">
          {{ scope.row.ai_state == 2 ? "下线" : "上线" }}
        </el-button>
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
import { getVirtualHumanList, addVirtualHuman, postOfflineAi } from "@/api/user/virtualHuman";
import { deepClone } from "@/utils/index";
import { saveAiUserPrompt } from "@/api/prompt";

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
const intention = ref();
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getVirtualHumanList"
const getTableList = (option: any) => {
  const params = {
    page: option.page,
    pageSize: option.pageSize,
    name: option.name,
    state: option.state
  };
  return getVirtualHumanList(params);
};

// 上线状态 字典
const getOnlineStatus = () => {
  return [
    // { stateLabel: "初始化", stateValue: 1 },
    { stateLabel: "上线", stateValue: 2 },
    { stateLabel: "下线", stateValue: 3 }
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
    label: "虚拟人昵称",
    width: "120",
    search: { el: "input", key: "name" }
  },
  {
    prop: "ai_uid",
    label: "虚拟人ID"
  },
  {
    prop: "avatar",
    label: "头像",
    width: "100",
    render: scope => {
      return (
        <el-image
          style="z-index:100;width:80px;height:80px;cursor: pointer;"
          src={scope.row.avatar}
          onClick={() => showImages(scope.row, 9)}
        ></el-image>
      );
    }
  },
  {
    prop: "tags",
    label: "AI标签"
  },
  {
    prop: "ai_state",
    label: "上线状态",
    search: { el: "tree-select", props: { filterable: true }, key: "state" },
    enum: getOnlineStatus(),
    fieldNames: { label: "stateLabel", value: "stateValue" }
  },
  {
    prop: "open_state",
    label: "公开状态",
    enum: getOpenStatus(),
    fieldNames: { label: "stateLabel", value: "stateValue" }
  },
  {
    prop: "weight",
    label: "Weight"
  },
  {
    prop: "bind_celebrity_account",
    label: "网红账号"
  },
  {
    prop: "prompt",
    label: "Prompt设置"
  },
  { prop: "operation", label: "操作", fixed: "right" }
];

//修改上线状态
const onChangeStatus = (ai_uid: string) => {
  postOfflineAi(ai_uid).then(res => {
    proTable.value?.getTableList();
  });
};

const getPhotomodel = (option: any) => {
  const params = {
    page: option.page,
    pageSize: option.pageSize,
    name: "",
    state: ""
  };
  getVirtualHumanList(params).then((res: any) => {
    if (res.code == 200) {
      generate_photo_model.value = res.data.options.generate_photo_btn.generate_photo_model;
      ai_classes.value = res.data.options.ai_classes.ai_class;
      // for (let i = 0; i < 3; i++) {
      //   res.data.options.intention.push("SpecialRequest_" + i);
      // }
      intention.value = res.data.options.intention;
    }
  });
};

getPhotomodel({ page: 1, pageSize: 1 });

const drawerRef = ref<InstanceType<typeof VirtualHumanDrawer> | null>(null);
//添加
const onAdd = (title: string, row?: {}) => {
  const params = {
    title,
    isView: title === "虚拟人详情",
    row: { ...row },
    api: addVirtualHuman,
    getTableList: proTable.value?.getTableList
  };
  const params2 = deepClone(params);
  params2.api = addVirtualHuman;
  params2.row.generatePhotModel = generate_photo_model;
  params2.row.ai_classes = ai_classes;
  params2.row.intention = intention;
  if (title === "虚拟人添加") {
    params2.row.intent_recognition_list = "";
  }

  params2.getTableList = proTable.value?.getTableList;
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
//添加
const onEdit = (title: string, row?: {}) => {
  const params = {
    title,
    isView: title === "编辑" ? false : true,
    row: { ...row },
    api: saveAiUserPrompt,
    getTableList: proTable.value?.getTableList
  };

  drawer2Ref.value?.acceptParams(params);
};
</script>
