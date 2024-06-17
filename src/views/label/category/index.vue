<template>
  <div class="p-category table-box">
    <ProTable
      ref="proTable"
      title="category"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="">
        <el-button type="primary" icon="CirclePlus" @click="handleAddCategory"> 添加 </el-button>
      </template>

      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link @click="handleEditCategory(scope.row)"> 编辑 </el-button>

        <el-popconfirm title="确定要删除?" @confirm="handleDeleteCategory(scope.row)">
          <template #reference>
            <el-button type="danger" link> 删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </ProTable>
  </div>

  <!-- 编辑抽屉 -->
  <CategoryEditDrawer ref="drawerRef" />
</template>

<script setup lang="tsx" name="Category">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { deleteCategory, getCategoryList, createCategory, updateCategory } from "@/api/label";
import CategoryEditDrawer from "../components/CategoryEditDrawer.vue";

const proTable = ref<ProTableInstance>();
const initParam = reactive({});

const columns: ColumnProps[] = [
  {
    prop: "label_index",
    label: "序号",
    width: "100",
    render: scope => {
      return <span>{scope.$index + 1}</span>;
    }
  },
  {
    prop: "category_name",
    label: "分类名称"
  },
  {
    prop: "category_weight",
    label: "排序权重",
    fieldNames: { label: "tag_weight", value: "tag_weight" }
  },
  {
    prop: "ai_count",
    label: "分类下AI数"
  },
  {
    prop: "operation",
    label: "操作",
    fixed: "right",
    width: "170"
  }
];

const getTableList = async (option: any) => {
  const params = {
    page: option.page,
    page_size: option.pageSize
  };
  return getCategoryList(params);
};

const drawerRef = ref<InstanceType<typeof CategoryEditDrawer> | null>(null);
const handleAddCategory = () => {
  const params = {
    row: {},
    isEdit: false,
    api: createCategory,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

const handleEditCategory = async (row: any) => {
  const params = {
    row: { id: row.id, category_name: row.category_name, category_weight: Number(row.category_weight) },
    isEdit: true,
    api: updateCategory,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

const handleDeleteCategory = async (row: any) => {
  deleteCategory({ id: row.id }).then(() => {
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
