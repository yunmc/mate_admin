<template>
  <div class="main-box">
    <div class="search flx-justify-between">
      <div class="flx-start">
        <div class="label flex">
          <p>模板 :</p>
          <div class="el-input">
            <el-select style="width: 100%" v-model="user.model_id" placeholder="请选择" clearable>
              <el-option v-for="item in modelList" :key="item.model_id" :label="item.relationship" :value="item.model_id" />
            </el-select>
          </div>
        </div>
        <div class="label flex">
          <p>相册等级 :</p>
          <div class="el-input">
            <el-select style="width: 100%" v-model="user.pic_level" placeholder="请选择" clearable>
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </div>
      </div>
      <div>
        <el-button type="primary" :icon="Search" @click="getTableList">查询</el-button>
      </div>
    </div>
    <div class="content">
      <div class="top flx-justify-between">
        <el-button type="primary" icon="CirclePlus" @click="onAdd('添加')"> 添加 </el-button>
        <el-button type="danger" icon="CirclePlus" @click="AllDelPicItem"> 批量删除 </el-button>
      </div>
      <div class="cont_table">
        <el-checkbox-group v-model="checkList">
          <div class="list" v-for="item in list" :key="item.id">
            <div class="flx-end"><el-checkbox :label="item.id" /></div>
            <div class="img">
              <el-image
                style="width: 160px; height: 180px"
                hide-on-click-modal
                :preview-src-list="[item.pic_source_url]"
                :src="item.pic_source_url"
                fit="cover"
              />
            </div>
            <div class="footer flx-justify-between">
              <span v-if="item.pic_level == 1">一级</span>
              <span v-else-if="item.pic_level == 2">二级</span>
              <span v-else-if="item.pic_level == 3">三级</span>
              <span v-else>四级</span>
              <el-dropdown>
                <span class="el-dropdown-link">
                  <el-icon class="more"><MoreFilled /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="delPicItem(item)">删除</el-dropdown-item>
                    <!-- <el-dropdown-item @click="onAdd('修改')">修改</el-dropdown-item> -->
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </el-checkbox-group>
      </div>
      <div class="demo-pagination-block flx-end">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[50, 100, 200, 300]"
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

<script setup lang="tsx" name="useInfo">
import { ref, reactive } from "vue";
import { Search } from "@element-plus/icons-vue";
import Drawer from "./components/Drawer.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getPugcList, getPugcPicSave, getPugcPicDel } from "@/api/user/pugc";
const small = ref(false);
const background = ref(true);
const disabled = ref(false);
const totals = ref(0);
const list = ref();
let modelList = ref([] as any);
const checkList = ref();
const options = [
  {
    value: "",
    label: "全部"
  },
  {
    value: "1",
    label: "一级"
  },
  {
    value: "2",
    label: "二级"
  },
  {
    value: "3",
    label: "三级"
  },
  {
    value: "4",
    label: "四级"
  }
];
const user = ref({
  model_id: "",
  pic_level: ""
});
const pagination = ref({
  page: 1,
  pageSize: 50
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
const AllDelPicItem = async () => {
  console.log(checkList.value == "");
  let params = {
    ids: [] as any
  };
  checkList.value.forEach((element: any) => {
    params.ids.push(element);
  });
  isDeep(params);
};

const delPicItem = async (item: { id: any }) => {
  let params = {
    ids: [] as any
  };
  params.ids.push(item.id);
  isDeep(params);
};

const isDeep = (params: { ids: any }) => {
  ElMessageBox.confirm("删除后不可恢复。", "确认要删除?", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    let data: any = await getPugcPicDel(params);
    if (data.code == 200) {
      getTableList();
    }
  });
};

const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
//添加
const onAdd = (title: string, row?: {}) => {
  const params = {
    title,
    isView: title === "修改",
    row: { ...row },
    modelList: modelList,
    api: getPugcPicSave,
    getTableList: getTableList
  };
  drawerRef.value?.acceptParams(params);
};

const getTableList = async () => {
  const params = {
    page: pagination.value.page,
    pageSize: pagination.value.pageSize,
    model_id: user.value.model_id,
    pic_level: user.value.pic_level
  };
  let data: any = await getPugcList(params);
  if (data.code == 200) {
    totals.value = data.data.total;
    list.value = data.data.list;
    modelList.value = data.data.model_list;
  }
};
getTableList();
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
    margin-bottom: 10px;
  }
  .cont_table {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    height: -moz-fit-content;
    height: 100%;

    // padding: 10px;
    overflow: scroll;
    font-size: 14px;
    color: var(--el-table-text-color);
    background-color: var(--el-table-border-color);
    border: 1px solid var(--el-border-color-light);
    border-radius: 6px;
  }
  .list {
    float: left;

    // width: 180px;
    padding: 0 10px;
    margin: 5px 10px;
    border: 1px solid var(--el-border-color-light);
    border-radius: 6px;
    box-shadow: 0 0 12px rgb(0 0 0 / 5%);
    .img {
      width: 160px;
      height: 180px;
      img {
        width: 160px;
        height: 180px;
      }
    }
    .footer {
      height: 40px;
      font-size: 14px;
      .more {
        cursor: pointer;
        transform: rotate(90deg);
      }
    }
  }
  .demo-pagination-block {
    margin-top: 20px;
  }
}
</style>
