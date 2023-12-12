<template>
  <el-dialog
    v-model="drawerVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :show-close="false"
    title="添加章节"
    width="50%"
    center
  >
    <!-- <span> It should be noted that the content will not be aligned in center by default </span> -->
    <div class="model_main">
      <div class="bindAi">
        <span>绑定AI</span>
        <el-select v-model="season_ai_uid" class="m-2" placeholder="选择">
          <el-option v-for="item in aiUsers" :key="item.ai_name" :label="item.ai_name" :value="item.ai_uid" />
        </el-select>
      </div>
      <div class="model_list flex" v-for="item in loraList" :key="item.id">
        <p class="flex">
          <el-input v-model="item.season_title" placeholder="章节名称">
            <template #prepend>章节名称</template>
          </el-input>
          <span></span>
          <el-input v-model="item.season_sort" placeholder="排序">
            <template #prepend>排序</template>
          </el-input>
        </p>
        <span class="flex">
          <el-icon @click="delModel(item)"><Close /></el-icon>
        </span>
      </div>
      <el-button @click="addModel()" type="primary">添加一列章节</el-button>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="operateModel()"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="UserDrawer">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ref, reactive, watch } from "vue";
// import { genderType } from "@/utils/serviceDict";
import { ElMessage, FormInstance } from "element-plus";
import { User } from "@/api/interface";
import { saveSeason, seasonList, delSeason, saveEpisode } from "@/api/playConfig/play.ts";
import { getPicList } from "@/api/gallery";
import UploadImg from "@/components/Upload/Img.vue";
import UploadVoice from "@/components/Upload/voice.vue";
import UploadImgs from "@/components/Upload/Imgs.vue";
import { deepClone } from "@/utils/index";

const rules = reactive({
  // name: [{ required: true, message: "请输入用户名" }],
  // sex: [{ required: true, message: "请选择性别" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<User.ResUserList>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
  generatePhotModel: Array;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});
const handleClose = (params: DrawerProps) => {};
const loraList = ref([]);
const season_ai_uid = ref("");
const editModel = () => {
  if (loraList.value == "" || loraList.value == undefined) {
    loraList.value.push({
      season_title: "",
      season_sort: ""
    });
  }
};

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  getAiUserList();
  editModel();
};

let aiUsers = ref([] as any);
const getAiUserList = async () => {
  const params = {
    page: 1,
    pageSize: 1,
    ai_uid: "",
    ai_name: "",
    pic_level: ""
  };
  let data: any = await getPicList(params);
  if (data.code == 200) {
    aiUsers.value = data.data.ai_users;
  }
};

const addModel = item => {
  loraList.value.push({
    season_title: "",
    season_sort: ""
  });
};

const delModel = item => {
  loraList.value.splice(loraList.value.indexOf(item), 1);
};

const operateModel = type => {
  if (season_ai_uid.value == "") {
    ElMessage.error("请选择要绑定的AI");
    return false;
  }
  loraList.value.forEach(element => {
    if (element.season_title == "" || element.season_sort == "") {
      ElMessage.error("请填写全部信息");
      return false;
    }
  });
  setTimeout(() => {
    adSeason();
  }, 1000);
};

const adSeason = () => {
  loraList.value.forEach(async (element, index) => {
    const params = {
      season_title: element.season_title,
      season_sort: Number(element.season_sort),
      season_ai_uid: season_ai_uid.value
    };
    await drawerProps.value.api!(params).then((res: any) => {
      if (res.code == 200) {
        if (index == loraList.value.length - 1) {
          ElMessage.success({ message: `${drawerProps.value.title}成功！` });
          drawerProps.value.getTableList!();
          drawerVisible.value = false;
        }
      }
    });
  });
};
// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      const params = {
        ...drawerProps.value.row,
        tags: tags.value
      };
      const res = await drawerProps.value.api!(params);
      if (res.code == "200") {
        ElMessage.success({ message: `${drawerProps.value.title}成功！` });
        drawerProps.value.getTableList!();
        drawerVisible.value = false;
      } else {
        ElMessage.warning({ message: res.msg });
      }
    } catch (error) {
      console.log(error);
    }
  });
};
defineExpose({
  acceptParams
});
</script>

<style lang="scss" scoped>
.bindAi {
  margin-bottom: 30px;
  span {
    margin-right: 10px;
  }
}
.model_list {
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 15px;
  p {
    width: 100%;
  }
  span {
    align-items: center;
    justify-content: space-between;
    margin-left: 10px;
    font-size: 24px;
    cursor: pointer;
  }
}
</style>
