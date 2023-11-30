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
      <template #uid="scope">
        <p>{{scope.row!.alias}}</p>
        <p>{{scope.row!.uid}}</p>
      </template>
      <template #soure="scope">
        <p v-if="scope.row!.voice_original_url == ''">--</p>
        <audio v-else controls :src="scope.row!.voice_original_url"></audio>
      </template>
      <template #state_type="scope">
        <span v-if="scope.row.ai_state > 2">下线</span>
        <span v-else>
          {{ scope.row.open_state == 2 ? "公开" : "私有" }}
        </span>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button v-if="scope.row.open_state == 2" type="primary" link @click="privacy(scope.row.ai_uid)"> 私密 </el-button>
        <el-button v-if="scope.row.open_state == 2" type="primary" link @click="Offline(scope.row.ai_uid)"> 下线 </el-button>
      </template>
    </ProTable>
    <PreviewImage ref="previewRef" />
  </div>
</template>

<script setup lang="tsx" name="useInfo">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import PreviewImage from "@/views/proTable/components/PreviewImage.vue";
import { getUserList, getRelationship, openState, offlineAiUser } from "@/api/user/ai";

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

const rspList = [
  {
    value: "",
    label: "全部"
  },
  {
    value: "Friend",
    label: "Friend"
  },
  {
    value: "Girlfriend",
    label: "Girlfriend"
  },
  {
    value: "Boyfriend",
    label: "Boyfriend"
  },
  {
    value: "Dominatrix",
    label: "Dominatrix"
  },
  {
    value: "Mild",
    label: "Mild"
  },
  {
    value: "School girl",
    label: "School girl"
  },
  {
    value: "Succubus",
    label: "Succubus"
  },
  {
    value: "Waifu",
    label: "Waifu"
  },
  {
    value: "MILF",
    label: "MILF"
  }
];

const relationshipList = () => {
  return rspList;
};
const getRelationshipList = async () => {
  let data: any = await getRelationship();
  Object.entries(data.data).forEach(element => {
    rspList.push({
      value: element[0],
      label: element[0]
    });
  });
  proTable.value?.reset;
  console.log("proTable", proTable.value);
  console.log("rspList", rspList);
};

// getRelationshipList();
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (option: any) => {
  console.log("option", option);
  const params = {
    page: option.page,
    pageSize: option.pageSize,
    sex: option.sex,
    uid: option.uid,
    ai_uid: option.ai_uid,
    state: option.state,
    relationship: option.relationship,
    stm: option.stm,
    etm: option.etm
  };
  if (option?.created_time) {
    params.stm = option?.created_time[0];
    params.etm = option?.created_time[1];
  }
  return getUserList(params);
};

const getAiSexStatus = () => {
  return [
    {
      value: "",
      label: "不限"
    },
    {
      value: "Male",
      label: "男"
    },
    {
      value: "Female",
      label: "女"
    }
  ];
};

const getAiStatus = () => {
  return [
    {
      value: 1,
      label: "私有"
    },
    {
      value: 2,
      label: "公开"
    }
  ];
};
// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
// const { BUTTONS } = useAuthButtons();

// 表格配置项
const columns: ColumnProps[] = [
  {
    prop: "introduce_image",
    label: "形象",
    width: "100",
    render: scope => {
      return (
        <el-image
          style="z-index:100;width:80px;height:80px;cursor: pointer;"
          src={scope.row.introduce_image}
          onClick={() => showImages(scope.row, 9)}
        ></el-image>
      );
    }
  },
  // render: scope => {
  //     return (
  //       <el-image
  //         style="z-index:100;width:80px;height:80px;cursor: pointer;"
  //         src={scope.row.avatar}
  //         onClick={() => showImages(scope.row, 9)}
  //       ></el-image>
  //     );
  //   }
  {
    prop: "ai_name",
    label: "昵称",
    search: { el: "input", key: "uid", label: "用户ID" }
  },
  {
    prop: "uid",
    label: "创作者"
  },
  {
    prop: "sex",
    label: "AI性别",
    search: { el: "tree-select", props: { filterable: true }, key: "sex" },
    enum: getAiSexStatus(),
    fieldNames: { label: "label", value: "value" }
  },
  {
    prop: "ai_class",
    label: "AI分类"
  },
  {
    prop: "ai_role",
    label: "AI角色"
  },
  {
    prop: "tags",
    label: "Tags"
  },
  {
    prop: "description",
    label: "AI介绍"
  },
  {
    prop: "lora_prompt",
    label: "Prompt描述词"
  },
  {
    prop: "open_remark",
    label: "开场白"
  },
  {
    prop: "dialogue_example",
    label: "对话示例(LIST)"
  },
  {
    prop: "soure",
    label: "声音选择"
  },
  {
    prop: "ai_chat_style",
    label: "对话风格"
  },
  {
    prop: "ai_uid",
    label: "虚拟人ID"
  },

  {
    prop: "created_time",
    label: "创建时间",
    search: {
      el: "date-picker",
      span: 1,
      props: { type: "datetimerange", valueFormat: "x" }
      // defaultValue: ["2022-11-12 11:35:00", "2022-12-12 11:35:00"]
    }
  },
  {
    prop: "updated_time",
    label: "最近修改时间"
  },
  // {
  //   prop: "open_state",
  //   label: "状态",
  //   search: { el: "tree-select", props: { filterable: true }, key: "state" },
  //   enum: getAiStatus(),
  //   fieldNames: { label: "label", value: "value" }
  // },
  {
    prop: "state_type",
    label: "状态"
  },
  { prop: "operation", label: "操作", fixed: "right" }
];

//查看详情
const goDetail = (row: { uid: string }) => {
  router.push("/user/user-info/detail?uid=" + row.uid);
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
const privacy = (id: any) => {
  ElMessageBox.confirm("确定设为私密上线？", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    let data: any = await openState({ ai_uid: id });
    if (data.code == 200) {
      proTable.value?.getTableList();
    }
  });
};

const Offline = (id: any) => {
  ElMessageBox.confirm("确定下线？", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    let data: any = await offlineAiUser({ ai_uid: id });
    if (data.code == 200) {
      proTable.value?.getTableList();
    }
  });
};
</script>
<style scoped lang="scss">
audio {
  width: 100%;
}
</style>
