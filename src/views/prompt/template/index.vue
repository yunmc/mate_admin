<template>
  <div class="main-box">
    <div class="content">
      <div class="top flex">
        <div>
          <p>自定义模板</p>
          <span>在写prompt中较好的格式，可以创建成模板保存，后续配置Prompt时仅需选择模板，配置变量即可。</span>
        </div>
        <div>
          <el-button type="primary" icon="CirclePlus" @click="onAdd('添加', data)"> 新增 </el-button>
        </div>
      </div>
      <!-- <div class="top flx-justify-between">
        <el-button type="primary" icon="CirclePlus" @click="onAdd('添加')"> 添加 </el-button>
        <el-button type="danger" icon="CirclePlus" @click="AllDelPicItem"> 批量删除 </el-button>
      </div> -->
      <div class="cont_table">
        <div class="cont_main">
          <el-row :gutter="10">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12" v-for="item in list" :key="item.id">
              <div class="grid-content">
                <div class="title">{{ item.template_name }}</div>
                <div class="desc flex">
                  <p>{{ item.remark ? item.remark : "--" }}</p>
                  <p>
                    <span @click="onAdd('编辑', item)">编辑</span>
                    <span @click="isDeep(item.id)">删除</span>
                  </p>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="demo-pagination-block flx-end">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :small="small"
          :disabled="disabled"
          :background="background"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <Drawer ref="drawerRef"></Drawer>
  </div>
</template>

<script setup lang="tsx" name="template">
// @ts-nocheck
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getTemplateList, saveTemplate, templateType, delTemplate } from "@/api/prompt";
import Drawer from "./detail.vue";
const small = ref(false);
const background = ref(true);
const disabled = ref(false);
const totals = ref(0);
const list = ref();
const pagination = ref({
  page: 1,
  pageSize: 10
});
const handleSizeChange = (val: number) => {
  pagination.value.page = 1;
  pagination.value.pageSize = val;
  getTableList();
};
const handleCurrentChange = (val: number) => {
  pagination.value.page = val;
  getTableList();
};

const isDeep = (params: { id: any }) => {
  ElMessageBox.confirm("删除后不可恢复。", "确认要删除?", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    let data: any = await delTemplate(params);
    if (data.code == 200) {
      getTableList();
    }
  });
};

const getTableList = async () => {
  const params = {
    page: pagination.value.page,
    pageSize: pagination.value.pageSize
  };
  let data: any = await getTemplateList(params);
  if (data.code == 200) {
    totals.value = data.data.total;
    list.value = data.data.list;
  }
};
getTableList();

const data = {
  template_name: "",
  template_content: "",
  template_vars: [],
  remark: "",
  text: ""
};

const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
//添加
const onAdd = (title: string, row?: {}) => {
  const params = {
    title,
    isView: title === "添加" ? false : true,
    row: { ...row },
    api: saveTemplate,
    getTableList: getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>

<style scoped lang="scss">
:deep {
  .el-checkbox__label {
    display: none;
  }
}
.main {
  display: block;
  flex: 1;
  flex-basis: auto;
  overflow: auto;
}
.main-box {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.search {
  box-sizing: border-box;
  padding: 10px 18px;
  margin-bottom: 10px;
  overflow-x: hidden;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  box-shadow: 0 0 12px rgb(0 0 0 / 5%);
  .label {
    align-items: center;
    justify-content: flex-start;
    font-size: 14px;
    color: var(--el-text-color-regular);
    p {
      padding: 0 12px 0 0;
    }
    .el-input {
      width: 280px;
      margin-right: 10px;
    }
  }
}
.content {
  box-sizing: border-box;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow-x: hidden;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  box-shadow: 0 0 12px rgb(0 0 0 / 5%);
  .top {
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    p {
      margin-bottom: 5px;
      font-size: 18px;
    }
    span {
      font-size: 14px;
    }
  }
  .cont_table {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    height: -moz-fit-content;
    height: 100%;

    // padding: 10px;
    overflow-y: auto;
    font-size: 14px;
    color: var(--el-table-text-color);
    background-color: var(--el-table-border-color);
    border-radius: 6px;
    .cont_main {
      overflow: hidden;
    }
  }
  .grid-content {
    height: 100px;
    padding: 0 30px;
    margin-bottom: 10px;
    overflow: hidden;
    background: #f2f3f5;
    .title {
      margin-top: 15px;
      font-size: 16px;
      color: #6178f0;
    }
    .desc {
      align-items: center;
      justify-content: space-between;
      margin-top: 20px;
      span {
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }
  .demo-pagination-block {
    margin-top: 20px;
  }
}
</style>
