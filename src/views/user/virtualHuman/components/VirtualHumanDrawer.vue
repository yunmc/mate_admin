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

      <el-form-item label="Sex" prop="Sex">
        <el-select v-model="drawerProps.row!.sex" placeholder="请选择">
          <el-option v-for="item in optionsSex" :key="item.label" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="create_by" prop="create_by">
        <el-input v-model="drawerProps.row!.create_by" placeholder="create_by" clearable></el-input>
      </el-form-item>

      <el-form-item label="Class" prop="Class">
        <el-select v-model="drawerProps.row!.ai_class" placeholder="请选择">
          <el-option v-for="item in drawerProps.row!.ai_classes" :key="item.title" :label="item.title" :value="item.title">
          </el-option>
        </el-select>
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

      <el-form-item label="底模类型" prop="open_state" v-if="drawerProps.row!.generate_photo_btn == 1">
        <div class="el_select flex">
          <el-select v-model="drawerProps.row!.generate_photo_model" placeholder="请选择">
            <el-option v-for="item in loraList" :key="item.id" :label="item.lora_name" :value="item.lora_value"> </el-option>
          </el-select>
          <p><el-button @click="editModel()" link>编辑</el-button></p>
        </div>
      </el-form-item>

      <el-form-item label="LoRa模型配置" prop="lora_prompt" v-if="drawerProps.row!.generate_photo_btn == 1">
        <el-input
          v-model="drawerProps.row!.lora_prompt"
          type="textarea"
          :rows="3"
          placeholder="请输入LoRa模型配置"
          clearable
        ></el-input>
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

  <el-dialog
    v-model="centerDialogVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :show-close="false"
    title="添加底模类型"
    width="40%"
    center
  >
    <!-- <span> It should be noted that the content will not be aligned in center by default </span> -->
    <div class="model_main">
      <div class="model_list flex" v-for="(item, index) in loraList" :key="item.id">
        <p class="flex">
          <el-input v-model="item.lora_name" placeholder="请输入Name">
            <template #prepend>Name</template>
          </el-input>
          <span></span>
          <el-input v-model="item.lora_value" placeholder="请输入vlaue">
            <template #prepend>vlaue</template>
          </el-input>
        </p>
        <span class="flex">
          <el-icon @click="delModel(item)" v-if="index < loraList.length - 1"><Close /></el-icon>
          <el-button v-else @click="addModel(item)" type="primary">添加</el-button>
        </span>
      </div>
    </div>
    <el-text class="mx-1" type="danger">点击删除时请确认，该模型没有线上AI配置使用。</el-text>
    <template #footer>
      <span class="dialog-footer">
        <!-- <el-button @click="operateModel(false)">取消</el-button> -->
        <el-button type="primary" @click="operateModel(true)"> 确定 </el-button>
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
import { getRelationship, getLoraList, addLora, delLora } from "@/api/prompt";
import UploadImg from "@/components/Upload/Img.vue";
import UploadVoice from "@/components/Upload/voice.vue";
import UploadImgs from "@/components/Upload/Imgs.vue";
import { deepClone } from "@/utils/index";

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

// 监听
watch(
  () => drawerProps.value.row!.generate_photo_btn,
  value => {
    if (!drawerProps.value.row!.generate_photo_btn) {
      drawerProps.value.row!.generate_photo_model = "";
      drawerProps.value.row!.lora_prompt = "";
    }
  }
);

const newDataIndex = ref([]);
const centerDialogVisible = ref(false);

const handleClose = (params: DrawerProps) => {
  drawerProps.value.isView = false;
  drawerProps.value.title = "";
  drawerProps.value.row = {};
  console.log("drawerProps", drawerProps);
  drawerVisible.value = false;
};

const generatePhotModelDeep = ref([]);
const editModel = () => {
  // console.log(loraList.value == "");
  if (loraList.value == "") {
    loraList.value.push({
      lora_name: "",
      lora_value: ""
    });
  }
  // generatePhotModelDeep.value = deepClone(drawerProps.value.row!.generatePhotModel);
  centerDialogVisible.value = true;
  // console.log(generatePhotModelDeep.value);
};

const operateModel = type => {
  loraList.value.forEach(element => {
    if (element.lora_name == "" && element.lora_value == "") {
      loraList.value.splice(loraList.value.indexOf(element), 1);
    }
  });
  centerDialogVisible.value = false;
};

const addModel = item => {
  if (item.lora_name == "" || item.lora_value == "") {
    ElMessage.error("请填写全部信息");
    return false;
  }
  if (item.id) {
    loraList.value.push({
      lora_name: "",
      lora_value: ""
    });
    return false;
  }
  const params = {
    lora_name: item.lora_name,
    lora_value: item.lora_value
  };
  addLora(params).then((res: any) => {
    if (res.code == 200) {
      getLoraListApi(true);
    }
  });
};

const delModel = item => {
  delLora({ id: item.id }).then((res: any) => {
    if (res.code == 200) {
      loraList.value.splice(loraList.value.indexOf(item), 1);
    }
  });
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
  console.log("params", params);
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
  getLoraListApi(false);
};

const loraList = ref();

const getLoraListApi = type => {
  const params = {
    page: 1,
    pageSize: 100
  };
  getLoraList(params).then((res: any) => {
    if (res.code == 200) {
      loraList.value = res.data.list.reverse();
      if (type) {
        loraList.value.push({
          lora_name: "",
          lora_value: ""
        });
      }
    }
  });
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
  if (drawerProps.value.row.create_by == "") {
    ElMessage.error("请输入create_by");
    return false;
  }
  if (drawerProps.value.row.ai_class == "") {
    ElMessage.error("请选择class");
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
