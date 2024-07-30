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
        <el-popconfirm title="确定要删除?" @confirm="handleDeleteBlog(scope.row)">
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
  <BlogEditDrawer ref="drawerRef" />
</template>

<script setup lang="tsx" name="channel">
import { ref, reactive } from "vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import PreviewImage from "@/views/proTable/components/PreviewImage.vue";
import { getBlogList, saveBlog, updateBlog, deleteBlog } from "@/api/blog";
import { deepClone } from "@/utils/index";
import BlogEditDrawer from "./components/BlogEditDrawer.vue";

const proTable = ref<ProTableInstance>();
const initParam = reactive({});
const getTableList = async (option: any) => {
  const params: any = {
    page: option.page,
    pageSize: option.pageSize,
    ai_platform: 2
  };
  return getBlogList(params);
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
    prop: "article_title",
    label: "标题"
  },
  {
    prop: "banner_url",
    label: "封面",
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
    prop: "article_weight",
    label: "排序权重",
    render: scope => scope.row.ai_user_info?.ai_name
  },
  {
    prop: "created_time",
    label: "创建时间",
    render: scope => scope.row.ai_user_info?.ai_uid
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

const drawerRef = ref<InstanceType<typeof BlogEditDrawer> | null>(null);

const handleAddChannel = () => {
  const params = {
    row: { online_status: 1 },
    isView: false,
    api: saveBlog,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
const handleEditChannel = (row: any) => {
  const params = {
    isView: false,
    row: { ...row },
    api: updateBlog,
    getTableList: proTable.value?.getTableList
  };
  const _params = deepClone(params); // 断一下引用
  _params.api = updateBlog;
  _params.getTableList = proTable.value?.getTableList;
  drawerRef.value?.acceptParams(_params);
};
const handleDeleteBlog = async (row: any) => {
  await deleteBlog({ id: row.id });
  proTable.value?.getTableList();
};
</script>

<style lang="scss" scoped>
.p-channel {
  ::v-deep img {
    object-fit: contain;
  }
}
</style>
