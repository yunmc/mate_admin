<template>
  <div class="p-moment table-box">
    <ProTable
      ref="proTable"
      title="momentList"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="">
        <el-button type="primary" icon="CirclePlus" @click="handleAddMoment()"> 添加 </el-button>
      </template>

      <template #ai_name="scope">
        {{ scope.row.ai_name }}
      </template>

      <!-- prompt 操作 -->
      <template #prompt="scope">
        <el-button link @click="handleEditPrompt('编辑', scope.row)"> 编辑</el-button>
        <el-button link @click="handleEditPrompt('查看', scope.row)"> 查看 </el-button>
      </template>

      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link @click="handleEditMoment(scope.row)"> 编辑 </el-button>
        <el-button type="primary" link @click="handleViewMoment(scope.row)"> 查看 </el-button>
        <el-button type="primary" link @click="handleChangeStatus(scope.row)">
          {{ scope.row.episode_online_state == 1 ? "下线" : "上线" }}
        </el-button>
      </template>
    </ProTable>
  </div>

  <!-- 图片预览 -->
  <PreviewImage ref="previewRef" />

  <!-- 编辑抽屉 -->
  <MomentEditDrawer ref="drawerRef" />

  <!-- Prompt 编辑弹窗 -->
  <PromptEditModal ref="modalRef" />
</template>

<script setup lang="tsx" name="moment">
import { ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import PreviewImage from "@/views/proTable/components/PreviewImage.vue";
import { getEpisodeList, saveEpisode, episodePrompt } from "@/api/playConfig/play";
import { getPicList } from "@/api/gallery";
import { deepClone } from "@/utils/index";
import { ElMessage } from "element-plus";
import { getVirtualHumanList } from "@/api/user/virtualHuman";
import { usePromptStore } from "@/stores/modules/prompt";
import MomentEditDrawer from "./components/MomentEditDrawer.vue";
import PromptEditModal from "./components/PromptEditModal.vue";

const router = useRouter();
const route = useRoute();

// 0:ios(web) 1:android 2:web大尺度
let ai_platform = 0;
if (route.name === "moment2") {
  ai_platform = 1;
}

const usePrompt = usePromptStore();

const proTable = ref<ProTableInstance>();
const initParam = reactive({});
// @tips：moment 就是 episode（剧本）。
const getTableList = async (option: any) => {
  const params: any = {
    page: option.page,
    pageSize: option.pageSize,
    ai_uid: option.ai_name,
    ai_platform
  };
  return getEpisodeList(params);
};
const getOnOffStatus = () => {
  return [
    { stateLabel: "上线", stateValue: 1 },
    { stateLabel: "下线", stateValue: 0 }
  ];
};
const getMomentType = () => {
  return [
    { stateLabel: "默认", stateValue: 0 },
    { stateLabel: "普通模式", stateValue: 1 },
    { stateLabel: "剧情挑战", stateValue: 2 }
  ];
};
const getMomentDefault = () => {
  return [
    { stateLabel: "否", stateValue: 0 },
    { stateLabel: "是", stateValue: 1 }
  ];
};
const previewRef = ref<InstanceType<typeof PreviewImage> | null>(null);
const showImages = (row: any, index: number) => {
  const params = {
    index: index,
    row: row
  };
  previewRef.value?.previewParams(params);
};
const columns: ColumnProps[] = [
  {
    prop: "ai_name",
    label: "AI昵称",
    width: "120",
    enum: () => getPicList({ page: 1, pageSize: 1, search: true, ai_platform }),
    search: { el: "select", props: { filterable: true } },
    fieldNames: { label: "ai_name", value: "ai_uid" }
  },
  {
    prop: "episode_ai_uid",
    label: "AI_ID"
  },
  {
    prop: "episode_alias",
    label: "Moment名称（内部）"
  },
  {
    prop: "episode_mode",
    label: "类型",
    enum: getMomentType(),
    fieldNames: { label: "stateLabel", value: "stateValue" }
  },
  {
    prop: "episode_sort",
    label: "序号"
  },
  {
    prop: "episode_default",
    label: "是否首页显示",
    enum: getMomentDefault(),
    fieldNames: { label: "stateLabel", value: "stateValue" }
  },
  {
    prop: "episode_thumbnail",
    label: "小card图",
    render: scope => {
      return (
        <el-image
          style="z-index:100;width:80px;height:80px;cursor: pointer;"
          src={scope.row.episode_thumbnail}
          onClick={() => showImages(scope.row.episode_thumbnail, 0)}
        />
      );
    },
    width: "100"
  },
  {
    prop: "prompt",
    label: "Prompt设置"
  },
  {
    prop: "episode_online_state",
    label: "上线状态",
    enum: getOnOffStatus(),
    fieldNames: { label: "stateLabel", value: "stateValue" }
  },
  {
    prop: "operation",
    label: "操作",
    fixed: "right",
    width: "170"
  }
];
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    page: data.page,
    pageSize: data.pageSize
  };
};

const drawerRef = ref<InstanceType<typeof MomentEditDrawer> | null>(null);

const handleAddMoment = () => {
  const params = {
    row: { episode_emotions: {} },
    isView: false,
    api: saveEpisode,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
const handleEditMoment = (row: any) => {
  const params = {
    isView: false,
    row: { ...row },
    api: saveEpisode,
    getTableList: proTable.value?.getTableList
  };
  const _params = deepClone(params); // 断一下引用
  _params.api = saveEpisode;
  _params.getTableList = proTable.value?.getTableList;
  drawerRef.value?.acceptParams(_params);
};
const handleViewMoment = (row: any) => {
  const params = {
    isView: true,
    row: { ...row },
    getTableList: proTable.value?.getTableList
  };
  // @todo：这里不知道为什么要 deep clone 一下，先这样。
  const _params = deepClone(params);
  drawerRef.value?.acceptParams(_params);
};
const handleChangeStatus = async (row: any) => {
  try {
    const params = { ...row, episode_online_state: ~~!row.episode_online_state, ai_platform };
    const resp: any = await saveEpisode(params);
    if (resp.code != 200) {
      return ElMessage.warning({ message: resp.msg });
    }
    ElMessage.success({ message: `${row.episode_online_state == 1 ? "下线" : "上线"}成功！` });
    row.episode_online_state = ~~!row.episode_online_state;
  } catch (e) {
    ElMessage.warning({ message: (e as any).toString() });
  }
};

const modalRef = ref<InstanceType<typeof PromptEditModal> | null>(null);
const handleEditPrompt = async (title: string, row: any) => {
  // - 普通模式，跳转到类 ai prompt 编辑的页面
  // - 挑战模式，弹窗
  if (row.episode_mode == 2) {
    // 挑战模式
    const params = {
      title,
      isView: title === "编辑" ? false : true,
      row: { ...row },
      api: episodePrompt,
      getTableList: proTable.value?.getTableList
    };
    modalRef.value?.acceptParams(params);
    return;
  }
  try {
    // @todo：拉取 moment 对应的 ai 信息，跳转到 prompt 编辑界面。
    const {
      data: { list }
    }: any = await getVirtualHumanList({ name: row.ai_name, page: 1, pageSize: 10, ai_platform });
    usePrompt.setPromptInfo(list[0], row);
    const req = {
      ai_uid: row.episode_ai_uid,
      moment_id: row.id,
      is_view: ~~(title === "查看")
    };
    router.push({
      name: "prompt2",
      query: req
    });
  } catch (e) {
    console.log(e);
  }
};
</script>

<style lang="scss" scoped>
.p-moment {
  ::v-deep img {
    object-fit: contain;
  }
}
</style>
