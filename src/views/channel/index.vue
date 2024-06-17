<template>
  <div class="p-channel table-box">
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
        <el-button type="primary" icon="CirclePlus" @click="handleAddChannel()"> 添加 </el-button>
      </template>

      <template #ai_name="scope">
        {{ scope.row.ai_name }}
      </template>

      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link @click="handleEditChannel(scope.row)"> 编辑 </el-button>
        <el-button type="primary" link @click="handleChangeStatus(scope.row)">
          {{ scope.row.online_status == 1 ? "下线" : "上线" }}
        </el-button>
        <el-popconfirm title="确定要删除?" @confirm="handleDeleteChannel(scope.row)">
          <template #reference>
            <el-button type="danger" link> 删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </ProTable>
  </div>

  <!-- 图片预览 -->
  <PreviewImage ref="previewRef" />

  <!-- 编辑抽屉 -->
  <ChannelEditDrawer ref="drawerRef" />
</template>

<script setup lang="tsx" name="channel">
import { ref, reactive } from "vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import PreviewImage from "@/views/proTable/components/PreviewImage.vue";
import { getChannelList, updateChannel, saveChannel, deleteChannel } from "@/api/channel";
import { deepClone } from "@/utils/index";
import { ElMessage } from "element-plus";
import ChannelEditDrawer from "./components/ChannelEditDrawer.vue";

const proTable = ref<ProTableInstance>();
const initParam = reactive({});
const getTableList = async (option: any) => {
  const params: any = {
    page: option.page,
    pageSize: option.pageSize
  };
  return getChannelList(params);
};
const getOnOffStatus = () => {
  return [
    { stateLabel: "上线", stateValue: 1 },
    { stateLabel: "下线", stateValue: 0 }
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
    prop: "channel_name",
    label: "合作渠道"
  },
  {
    prop: "ai_name",
    label: "虚拟人昵称",
    render: scope => scope.row.ai_user_info?.ai_name
  },
  {
    prop: "ai_uid",
    label: "虚拟人ID",
    render: scope => scope.row.ai_user_info?.ai_uid
  },
  {
    prop: "ai_avatar",
    label: "虚拟人头像",
    width: "100",
    render: scope => {
      return (
        <el-image
          style="z-index:100;width:80px;height:80px;cursor: pointer;"
          src={scope.row.ai_user_info?.avatar}
          onClick={() => showImages(scope.row.ai_user_info?.avatar, 0)}
        />
      );
    }
  },
  {
    prop: "channel_url",
    label: "渠道链接",
    width: "150",
    render: scope => {
      return (
        <span>
          {scope.row.channel_url}
          <a style="display: block;cursor: pointer;color: rgb(64, 149, 229);" onClick={() => copyText(scope.row.channel_url)}>
            复制
          </a>
        </span>
      );
    }
  },
  {
    prop: "channel_data_url",
    label: "看数据的地址",
    width: "150",
    render: scope => {
      return (
        <span>
          {scope.row.channel_data_url}
          <a
            style="display: block;cursor: pointer;color: rgb(64, 149, 229);"
            onClick={() => copyText(scope.row.channel_data_url)}
          >
            复制
          </a>
        </span>
      );
    }
  },
  {
    prop: "banner_url",
    label: "活动图",
    width: "140",
    render: scope => {
      return (
        <el-image
          style="z-index:100;width:120px;cursor: pointer;"
          src={scope.row.banner_url}
          onClick={() => showImages(scope.row.banner_url, 0)}
        />
      );
    }
  },
  {
    prop: "online_status",
    label: "状态",
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

const drawerRef = ref<InstanceType<typeof ChannelEditDrawer> | null>(null);

const handleAddChannel = () => {
  const params = {
    row: { online_status: 1 },
    isView: false,
    api: saveChannel,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
const handleEditChannel = (row: any) => {
  const params = {
    isView: false,
    row: { ...row },
    api: updateChannel,
    getTableList: proTable.value?.getTableList
  };
  const _params = deepClone(params); // 断一下引用
  _params.api = updateChannel;
  _params.getTableList = proTable.value?.getTableList;
  drawerRef.value?.acceptParams(_params);
};
const handleChangeStatus = async (row: any) => {
  try {
    const params = {
      id: row.id,
      channel_name: row.channel_name,
      ai_uid: row.ai_uid,
      online_status: ~~!row.online_status,
      banner_url: row.banner_url
    };
    const resp: any = await updateChannel(params);
    if (resp.code != 200) {
      return ElMessage.warning({ message: resp.msg });
    }
    ElMessage.success({ message: `${row.online_status == 1 ? "下线" : "上线"}成功！` });
    row.online_status = ~~!row.online_status;
  } catch (e) {
    ElMessage.warning({ message: (e as any).toString() });
  }
};
const handleDeleteChannel = async (row: any) => {
  await deleteChannel({ id: row.id });
  proTable.value?.getTableList();
};
const copyText = async (text: string) => {
  await navigator.clipboard.writeText(text);
  console.log(`复制 ${text} 成功。`);
};
</script>

<style lang="scss" scoped>
.p-channel {
  ::v-deep img {
    object-fit: contain;
  }
}
</style>
