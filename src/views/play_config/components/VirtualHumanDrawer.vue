<template>
  <el-drawer
    v-model="drawerVisible"
    :destroy-on-close="true"
    @before-close="handleClose"
    size="760px"
    :title="`${drawerProps.title}`"
  >
    <el-form
      ref="ruleFormRef"
      label-width="178px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <!-- <div class="title flex">AI信息(Prompt)</div> -->
      <!-- <div class="title">绑定AI</div>
      <el-form-item label="AI昵称" prop="episode_ai_uid">
        <el-select v-model="drawerProps.row!.episode_ai_uid" placeholder="请选择">
          <el-option v-for="item in aiUsers" :key="item.ai_name" :label="item.ai_name" :value="item.ai_uid"> </el-option>
        </el-select>
      </el-form-item> -->
      <div class="title">关卡配置</div>

      <el-form-item label="章节名称" prop="open_state">
        <div class="el_select flex">
          <el-select v-model="drawerProps.row!.episode_sid" placeholder="请选择" @change="changeUid($event)">
            <el-option v-for="item in  drawerProps.row!.loraList" :key="item.id" :label="item.season_title" :value="item.id">
            </el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="关卡名称" prop="episode_title">
        <el-input v-model="drawerProps.row!.episode_title" placeholder="episode_title" clearable></el-input>
      </el-form-item>
      <el-form-item label="关卡排序" prop="episode_sort">
        <el-input v-model="drawerProps.row!.episode_sort" placeholder="episode_sort" clearable></el-input>
      </el-form-item>
      <el-form-item label="背景描述" prop="episode_background">
        <el-input
          v-model="drawerProps.row!.episode_background"
          type="textarea"
          :rows="3"
          placeholder="episode_background"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="任务描述" prop="episode_task_desc">
        <el-input
          v-model="drawerProps.row!.episode_task_desc"
          type="textarea"
          :rows="3"
          placeholder="episode_task_desc"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="关卡默认解锁状态" prop="episode_unlock_state">
        <el-switch v-model="drawerProps.row!.episode_unlock_state" />
      </el-form-item>

      <el-form-item label="关卡解锁Keyword" prop="episode_unlock_key">
        <el-input v-model="drawerProps.row!.episode_unlock_key" placeholder="episode_unlock_key" clearable></el-input>
      </el-form-item>
      <el-form-item label="关卡解锁提示语" prop="episode_unlock_notice">
        <el-input v-model="drawerProps.row!.episode_unlock_notice" placeholder="episode_unlock_notice" clearable></el-input>
      </el-form-item>

      <el-form-item label="关卡缩略图" prop="Avatar:">
        <UploadImg v-model:image-url="drawerProps.row!.episode_thumbnail" width="135px" height="135px" :file-size="3">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传照片</span>
          </template>
          <!-- <template #tip> 头像大小不能超过 3M </template> -->
        </UploadImg>
      </el-form-item>
      <el-form-item label="主动付费解锁金币" prop="episode_done_coin">
        <el-input v-model="drawerProps.row!.episode_done_coin" placeholder="episode_done_coin" clearable></el-input>
      </el-form-item>
      <el-form-item label="关卡挑战次数" prop="episode_challenge_times">
        <el-input v-model="drawerProps.row!.episode_challenge_times" placeholder="episode_challenge_times" clearable></el-input>
      </el-form-item>
      <el-form-item label="关卡对话轮次" prop="episode_chat_round">
        <el-input v-model="drawerProps.row!.episode_chat_round" placeholder="episode_chat_round" clearable></el-input>
      </el-form-item>

      <div class="title">关卡对话配置</div>
      <el-form-item label="关卡背景图" prop="episode_bg_image">
        <UploadImg v-model:image-url="drawerProps.row!.episode_bg_image" width="135px" height="135px" :file-size="3">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传照片</span>
          </template>
          <!-- <template #tip> 头像大小不能超过 3M </template> -->
        </UploadImg>
      </el-form-item>
      <el-form-item label="旁白" prop="episode_aside">
        <el-input v-model="drawerProps.row!.episode_aside" placeholder="episode_aside" clearable></el-input>
      </el-form-item>
      <el-form-item label="开场白" prop="episode_remarks">
        <el-input v-model="drawerProps.row!.episode_remarks" placeholder="episode_remarks" clearable></el-input>
      </el-form-item>

      <el-form-item label="开场白图片" prop="episode_remarks_img">
        <UploadImg v-model:image-url="drawerProps.row!.episode_remarks_img" height="140px" width="140px" :file-size="5">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传照片</span>
          </template>
          <!-- <template #tip> 照片大小不能超过 5M </template> -->
        </UploadImg>
      </el-form-item>
      <div class="title">关卡配置</div>
      <el-form-item label="是否上线" prop="episode_online_state">
        <el-switch v-model="drawerProps.row!.episode_online_state" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false"> 取消 </el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit"> 确定 </el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ref, reactive, watch } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { User } from "@/api/interface";
import UploadImg from "@/components/Upload/Img.vue";

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

const changeUid = event => {
  const item = drawerProps.value.row!.loraList.find(function (item) {
    return item.id == event;
  });
  drawerProps.value.row!.episode_ai_uid = item.season_ai_uid;
};

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});
const handleClose = (params: DrawerProps) => {
  drawerProps.value.isView = false;
  drawerProps.value.title = "";
  drawerProps.value.row = {};
  drawerVisible.value = false;
};
// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerProps.value.row!.episode_online_state = drawerProps.value.row!.episode_online_state == 1 ? true : false;
  drawerProps.value.row!.episode_unlock_state = drawerProps.value.row!.episode_unlock_state == 1 ? true : false;
  drawerVisible.value = true;
  // getLoraListApi();
};

// const loraList = ref([]);

// const getLoraListApi = type => {
//   const params = {
//     page: 1,
//     pageSize: 1000
//   };
//   seasonList(params).then((res: any) => {
//     if (res.code == 200) {
//       loraList.value = res.data.list.reverse();
//     }
//   });
// };

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  // if (drawerProps.value.row.ai_name == "") {
  //   ElMessage.error("请输入姓名");
  //   return false;
  // }
  // if (drawerProps.value.row.create_by == "") {
  //   ElMessage.error("请输入create_by");
  //   return false;
  // }
  // if (drawerProps.value.row.ai_class == "") {
  //   ElMessage.error("请选择class");
  //   return false;
  // }
  ruleFormRef.value!.validate(async valid => {
    drawerProps.value.row!.episode_online_state = drawerProps.value.row!.episode_online_state ? 1 : 0;
    drawerProps.value.row!.episode_unlock_state = drawerProps.value.row!.episode_unlock_state ? 1 : 0;
    if (!valid) return;
    try {
      const params = {
        ...drawerProps.value.row
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
.el-tag {
  margin-right: 10px;
  cursor: pointer;
}
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 15px;
  margin-bottom: 20px;
  font-weight: bold;
  border-bottom: 1px solid var(--el-border-color-lighter);
}
.el_select {
  width: 100%;
  p {
    width: 80px;
    margin-left: 20px;
  }
}
.model_main {
  // max-height: 500px;
  // overflow: auto;
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
