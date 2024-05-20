<template>
  <div class="p-top-level-label table-box">
    <ProTable
      ref="proTable"
      title="topLevelLabelList"
      :columns="columns"
      :request-api="getLabelList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="">
        <el-button type="primary" icon="CirclePlus" @click="handleAddLabel"> 添加 </el-button>
      </template>

      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link @click="handleEditLabel(scope.row)"> 编辑 </el-button>

        <el-popconfirm title="确定要删除?" @confirm="handleDeleteLabel(scope.row)">
          <template #reference>
            <el-button type="danger" link> 删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </ProTable>
  </div>

  <!-- 编辑抽屉 -->
  <LabelEditDrawer ref="drawerRef" />
</template>

<script setup lang="tsx" name="TopLevelLabel">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import LabelEditDrawer from "../components/LabelEditDrawer.vue";
import { deleteTag, getTagList, saveTag, updateTag } from "@/api/label";

const router = useRouter();

const proTable = ref<ProTableInstance>();
const initParam = reactive({});

const columns: ColumnProps[] = [
  {
    prop: "label_index",
    label: "序号",
    width: "120",
    render: scope => {
      return <span>{scope.$index + 1}</span>;
    }
  },
  {
    prop: "tag_name",
    label: "标签名称",
    fieldNames: { label: "tag_name", value: "tag_name" }
  },
  {
    prop: "tag_weight",
    label: "排序权重",
    width: "120",
    fieldNames: { label: "tag_weight", value: "tag_weight" }
  },
  {
    prop: "created_time",
    label: "创建时间",
    width: "200",
    fieldNames: { label: "created_time", value: "created_time" }
  },
  {
    prop: "operation",
    label: "操作",
    fixed: "right",
    width: "170"
  }
];

const getLabelList = async (option: any) => {
  const params = {
    page: option.page,
    page_size: option.pageSize,
    tag_level: 0
  };
  return getTagList(params);
};

const drawerRef = ref<InstanceType<typeof LabelEditDrawer> | null>(null);
const handleAddLabel = () => {
  const params = {
    row: { tag_level: 1 },
    isEdit: false,
    api: saveTag,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

const handleEditLabel = async (row: any) => {
  const params = {
    row: { ...row },
    isEdit: true,
    api: updateTag,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

const handleDeleteLabel = async (row: any) => {
  deleteTag(row).then(() => {
    proTable.value?.getTableList();
  });
};

const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    page: data.page,
    pageSize: data.pageSize
  };
};
</script>

<style lang="scss" scoped></style>
