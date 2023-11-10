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
      <div class="title">展示信息</div>

      <el-form-item label="Name" prop="Name">
        <el-input v-model="drawerProps.row!.ai_name" placeholder="name" clearable></el-input>
      </el-form-item>

      <el-form-item label="avatar" prop="Avatar:">
        <UploadImg v-model:image-url="drawerProps.row!.avatar" width="135px" height="135px" :file-size="3">
          <template #empty>
            <el-icon><Avatar /></el-icon>
            <span>请上传头像</span>
          </template>
          <template #tip> 头像大小不能超过 3M </template>
        </UploadImg>
      </el-form-item>

      <el-form-item label="introduce_image" prop="introduce_image">
        <UploadImg v-model:image-url="drawerProps.row!.introduce_image" height="140px" width="140px" :file-size="5">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传照片</span>
          </template>
          <template #tip> 照片大小不能超过 5M </template>
        </UploadImg>
      </el-form-item>

      <el-form-item label="posters" prop="images">
        <UploadImgs v-model:file-list="drawerProps.row!.images" :limit="9" height="140px" width="140px">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传照片</span>
          </template>
          <template #tip> 最多上传 9 张照片 </template>
        </UploadImgs>
      </el-form-item>

      <el-form-item label="Description" prop="ai_desc">
        <el-input v-model="drawerProps.row!.ai_desc" type="textarea" :rows="3" placeholder="ai_desc" clearable></el-input>
      </el-form-item>

      <el-form-item label="虚拟人标签" prop="tags">
        <el-tag
          class="mx-1"
          :closable="!drawerProps.isView"
          effect="dark"
          v-for="(tag, index) in tags"
          :key="tag"
          @close="onDelTag(index)"
          style="margin-top: 10px"
        >
          {{ tag }}
        </el-tag>
        <template v-if="!drawerProps.isView">
          <el-input
            v-model="tagtxt"
            v-if="tags.length < 6"
            placeholder="请输入标签名"
            maxlength="20"
            style="width: 120px; margin-top: 10px; margin-right: 10px"
          />
          <el-tag class="mx-1" style="margin-top: 10px" v-if="tags.length < 6" @click="onAddTag">添加标签</el-tag>
        </template>
      </el-form-item>

      <div class="title">声音信息</div>

      <el-form-item label="voice_speed" prop="voice_speed">
        <!-- <el-input v-model="drawerProps.row!.voice_speed" placeholder="voice_speed" clearable></el-input> -->
        <el-slider
          :show-input="true"
          :show-input-controls="false"
          style="width: 100% !important; margin-left: 2%"
          :min="0"
          :max="10"
          v-model="drawerProps.row!.voice_speed"
        />
      </el-form-item>

      <el-form-item label="Clone_voice" prop="clone_voice">
        <el-input v-model="drawerProps.row!.clone_voice" placeholder="clone_voice" clearable></el-input>
      </el-form-item>

      <!-- <el-form-item label="Voice_introduct" prop="voice_introduct">
        <el-input v-model="drawerProps.row!.voice_introduct" placeholder="voice_introduct" clearable></el-input>
      </el-form-item> -->

      <el-form-item label="Voice_introduct" prop="voice_introduct">
        <UploadVoice v-model:image-url="drawerProps.row!.voice_introduct" height="140px" width="540px" :file-size="10">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传音频文件</span>
          </template>
          <template #tip> 音频大小不能超过 10M </template>
        </UploadVoice>
      </el-form-item>

      <el-form-item label="voice_orginal_url" prop="voice_orginal_url">
        <UploadVoice v-model:image-url="drawerProps.row!.voice_orginal_url" height="140px" width="540px" :file-size="10">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传音频文件</span>
          </template>
          <template #tip> 音频大小不能超过 10M </template>
        </UploadVoice>
      </el-form-item>

      <div class="title">对话设置</div>
      <el-form-item label="开场白" prop="open_remark">
        <el-input
          v-model="drawerProps.row!.open_remark"
          type="textarea"
          :rows="3"
          placeholder="请输入开场白"
          clearable
        ></el-input>
      </el-form-item>

      <!-- <el-form-item label="默认对话模式" prop="default_chat_mode">
        <el-radio-group v-model="drawerProps.row!.default_chat_mode" @change="drawerProps.row!.set_chat_mode_permission = 0">
          <el-radio :label="2">心动模式</el-radio>
          <el-radio :label="1">普通模式</el-radio>
        </el-radio-group>
      </el-form-item> -->

      <el-form-item label="展示功能" prop="">
        <el-checkbox
          v-model="drawerProps.row!.private_date_btn"
          :checked="drawerProps.row!.private_date_btn == 1"
          label="私密约会"
          size="large"
        />
        <el-checkbox
          v-model="drawerProps.row!.role_play_btn"
          :checked="drawerProps.row!.role_play_btn == 1"
          label="角色扮演"
          size="large"
        />
        <el-checkbox
          v-model="drawerProps.row!.generate_photo_btn"
          :checked="drawerProps.row!.generate_photo_btn == 1"
          label="AI合照"
          size="large"
        />
        <el-checkbox
          v-model="drawerProps.row!.selfie_btn_show"
          :checked="drawerProps.row!.selfie_btn_show == 1"
          label="自拍照"
          size="large"
        />
        <!-- <el-switch v-model="drawerProps.row!.default_chat_mode" /> -->
      </el-form-item>
      <el-form-item label="AI合照类型" v-if="drawerProps.row!.generate_photo_btn == 1" prop="generatePhotModel">
        <el-radio
          v-model="drawerProps.row!.generate_photo_model"
          v-for="item in drawerProps.row!.generatePhotModel"
          :key="item"
          :label="item.value"
        >
          {{ item.name }}
        </el-radio>
      </el-form-item>

      <!-- params.generatePhotModel._value[0] -->
      <div class="title">AI设置</div>
      <el-form-item label="是否会员" prop="vip_exclusive">
        <el-radio-group v-model="drawerProps.row!.vip_exclusive">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="关联网红账号" prop="bind_celebrity_account">
        <el-input v-model="drawerProps.row!.bind_celebrity_account" placeholder="请输入网红账号" clearable></el-input>
      </el-form-item>
      <el-form-item label="公开状态" prop="open_state">
        <el-select v-model="drawerProps.row!.open_state" placeholder="请选择">
          <el-option v-for="item in optionOpenState" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Weight" prop="weight">
        <el-input v-model="drawerProps.row!.weight" placeholder="weight" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false"> 取消 </el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit"> 确定 </el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive, watch } from "vue";
// import { genderType } from "@/utils/serviceDict";
import { ElMessage, FormInstance } from "element-plus";
import { User } from "@/api/interface";
import { getRelationship } from "@/api/prompt";
import UploadImg from "@/components/Upload/Img.vue";
import UploadVoice from "@/components/Upload/voice.vue";
import UploadImgs from "@/components/Upload/Imgs.vue";

const rules = reactive({
  // name: [{ required: true, message: "请输入用户名" }],
  // sex: [{ required: true, message: "请选择性别" }]
});
const checkedCities = ref(["Shanghai", "Beijing"]);
const cities = ["Shanghai", "Beijing", "Guangzhou", "Shenzhen"];

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

const newDataIndex = ref([]);

const handleClose = (params: DrawerProps) => {
  drawerProps.value.isView = false;
  drawerProps.value.title = "";
  drawerProps.value.row = {};
  console.log("drawerProps", drawerProps);
  drawerVisible.value = false;
};

const optionsSex = [
  {
    value: "Male",
    label: "Male"
  },
  {
    value: "Female",
    label: "Female"
  },
  {
    value: "Other",
    label: "Other"
  }
];

const optionsState = [
  {
    value: 2,
    label: "上线"
  },
  {
    value: 3,
    label: "下线"
  }
];

const optionOpenState = [
  {
    value: 1,
    label: "私密"
  },
  {
    value: 2,
    label: "公开"
  }
];
// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  // console.log("drawerProps", params.generatePhotModel._value[0]);
  drawerProps.value.row.images = [];
  if (drawerProps.value.row.posters) {
    drawerProps.value.row.posters.forEach((element: any) => {
      drawerProps.value.row.images.push({
        name: "1",
        url: element
      });
    });
  }
  tags.value = params.row.tags || [];
  drawerProps.value.row.private_date_btn = drawerProps.value.row.private_date_btn == "1" ? true : false;
  drawerProps.value.row.role_play_btn = drawerProps.value.row.role_play_btn == "1" ? true : false;
  drawerProps.value.row.generate_photo_btn = drawerProps.value.row.generate_photo_btn == "1" ? true : false;
  drawerProps.value.row.selfie_btn_show = drawerProps.value.row.selfie_btn_show == "1" ? true : false;
  drawerVisible.value = true;
};

const tags = ref<string[]>([]);
const tagtxt = ref<string>("");
// 添加标签
const onAddTag = () => {
  if (!tagtxt.value || tags.value.includes(tagtxt.value)) return;
  tags.value.push(tagtxt.value);
  tagtxt.value = "";
};

//删除标签
const onDelTag = (index: number) => {
  tags.value.splice(index, 1);
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  if (drawerProps.value.row.ai_name == "") {
    ElMessage.error("请输入姓名");
    return false;
  }
  drawerProps.value.row.name = drawerProps.value.row.ai_name;
  drawerProps.value.row.private_date_btn = drawerProps.value.row.private_date_btn ? "1" : "0";
  drawerProps.value.row.role_play_btn = drawerProps.value.row.role_play_btn ? "1" : "0";
  drawerProps.value.row.generate_photo_btn = drawerProps.value.row.generate_photo_btn ? "1" : "0";
  drawerProps.value.row.selfie_btn_show = drawerProps.value.row.selfie_btn_show ? "1" : "0";
  drawerProps.value.row.posters = [];
  // console.log("drawerProps.value.row.images", drawerProps.value.row.images != undefined);
  drawerProps.value.row.images.forEach((element: { url: any }) => {
    drawerProps.value.row.posters.push(element.url);
  });
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
</style>
