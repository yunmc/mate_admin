<template>
  <div class="p-channel table-box">
    <ProTable
      ref="proTable"
      title="momentList"
      :columns="columns"
      :request-api="_getBannerList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link @click="handleEditChannel(scope.row)"> 编辑 </el-button>
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
import { getBannerList } from "@/api/banner";
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
const _getBannerList = async (option: any) => {
  console.log(getBannerList());
  return getBannerList();
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
    prop: "banner_url",
    label: "活动图",
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
    prop: "operation",
    label: "操作",
    fixed: "right",
    width: "170"
  }
];
const dataCallback = (data: any) => {
  console.log(data);
  //data目前是一个对象，需要转换成数组
  return {
    list: data.list
  };
};

const drawerRef = ref<InstanceType<typeof ChannelEditDrawer> | null>(null);

const handleEditChannel = (row: any) => {
  console.log(row);
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
