<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="760px" :title="`${drawerProps.title}`">
    <el-form
      ref="ruleFormRef"
      label-width="170px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="Name" prop="ai_name">
        <el-input v-model="drawerProps.row!.ai_name" placeholder="Name" clearable></el-input>
      </el-form-item>

      <el-form-item label="Sex" prop="sex">
        <el-select v-model="drawerProps.row!.sex" placeholder="请选择">
          <el-option v-for="item in optionsSex" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Mbti" prop="mbti">
        <el-input v-model="drawerProps.row!.mbti" placeholder="mbti" clearable></el-input>
      </el-form-item>

      <el-form-item label="Create By" prop="create_by">
        <el-input v-model="drawerProps.row!.create_by" placeholder="create_by" clearable></el-input>
      </el-form-item>

      <el-form-item label="Birthday" prop="birthdate">
        <el-input v-model="drawerProps.row!.birthdate" placeholder="birthdate" clearable></el-input>
      </el-form-item>

      <el-form-item label="Expression_mode" prop="expression_mode">
        <el-input v-model="drawerProps.row!.expression_mode" placeholder="expression_mode" clearable></el-input>
      </el-form-item>

      <el-form-item label="Occupation" prop="expression_mode">
        <el-input v-model="drawerProps.row!.occupation" placeholder="occupation" clearable></el-input>
      </el-form-item>

      <el-form-item label="Nickname" prop="nick_name">
        <el-input v-model="drawerProps.row!.nick_name" placeholder="nick_name" clearable></el-input>
      </el-form-item>

      <el-form-item label="Relationship" prop="relationship">
        <el-input v-model="drawerProps.row!.relationship" placeholder="relationship" clearable></el-input>
      </el-form-item>

      <el-form-item label="Sexual 0relationship" prop="sexual_orientation">
        <el-input v-model="drawerProps.row!.sexual_orientation" placeholder="sexual_orientation" clearable></el-input>
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

      <el-form-item label="index_image" prop="index_image">
        <UploadImg v-model:image-url="drawerProps.row!.index_image" height="140px" width="140px" :file-size="5">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传照片</span>
          </template>
          <template #tip> 照片大小不能超过 5M </template>
        </UploadImg>
      </el-form-item>

      <el-form-item label="Description" prop="ai_desc">
        <el-input v-model="drawerProps.row!.ai_desc" type="textarea" :rows="3" placeholder="ai_desc" clearable></el-input>
      </el-form-item>

      <el-form-item label="Add" prop="add">
        <el-input v-model="drawerProps.row!.add" type="textarea" :rows="3" placeholder="add" clearable></el-input>
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

      <el-form-item label="Weight" prop="weight">
        <el-input v-model="drawerProps.row!.weight" placeholder="weight" clearable></el-input>
      </el-form-item>

      <!-- <el-form-item label="State" prop="ai_state">
        <el-select v-model="drawerProps.row!.ai_state" placeholder="请选择">
          <el-option v-for="item in optionsState" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item> -->

      <el-form-item label="公开状态" prop="open_state">
        <el-select v-model="drawerProps.row!.open_state" placeholder="请选择">
          <el-option v-for="item in optionOpenState" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户ID" prop="user_account">
        <el-input v-model="drawerProps.row!.user_account" placeholder="请输入要绑定的用户账号"></el-input>
      </el-form-item>
      <el-form-item label="虚拟人标签" prop="tags">
        <el-tag
          class="mx-1"
          :closable="!drawerProps.isView"
          effect="dark"
          v-for="(tag, index) in tags"
          :key="tag"
          @close="onDelTag(index)"
        >
          {{ tag }}
        </el-tag>
        <template v-if="!drawerProps.isView">
          <el-tag class="mx-1" @click="onAddTag">添加标签</el-tag>
          <el-input v-model="tagtxt" placeholder="请输入标签名" style="width: 120px" />
        </template>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false"> 取消 </el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit"> 确定 </el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive } from "vue";
// import { genderType } from "@/utils/serviceDict";
import { ElMessage, FormInstance } from "element-plus";
import { User } from "@/api/interface";
import UploadImg from "@/components/Upload/Img.vue";
import UploadVoice from "@/components/Upload/voice.vue";
// import UploadImgs from "@/components/Upload/Imgs.vue";

const rules = reactive({
  ai_name: [{ required: true, message: "请输入用户名" }]
  // ai_state: [{ required: true, message: "请选择状态" }]
  // avatar: [{ required: true, message: "请上传用户头像" }],
  // photo: [{ required: true, message: "请上传用户照片" }],
  // username: [{ required: true, message: "请填写用户姓名" }],
  // gender: [{ required: true, message: "请选择性别" }],
  // idCard: [{ required: true, message: "请填写身份证号" }],
  // email: [{ required: true, message: "请填写邮箱" }],
  // address: [{ required: true, message: "请填写居住地址" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<User.ResUserList>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

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
  // {
  //   value: 1,
  //   label: "上线中"
  // },
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

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  tags.value = params.row.tags || [];
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
  drawerProps.value.row.name = drawerProps.value.row.ai_name;
  drawerProps.value.row.desc = drawerProps.value.row.ai_desc;
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
</style>
