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

      <!-- <el-form-item label="时刻moment" prop="Class">
        <el-input v-model="drawerProps.row!.moment" placeholder="时刻moment" clearable></el-input>
      </el-form-item> -->

      <!-- <el-form-item label="Class" prop="Class">
        <el-select v-model="drawerProps.row!.ai_class" placeholder="请选择">
          <el-option v-for="item in drawerProps.row!.ai_classes" :key="item.title" :label="item.title" :value="item.title">
          </el-option>
        </el-select>
      </el-form-item> -->

      <el-form-item label="Class" prop="category" v-for="(category, index) in saveParams.categories" :key="category">
        <el-select v-model="saveParams.categories[index]">
          <el-option v-for="item in allCategories" :key="item.id" :label="item.category_name" :value="item.id" />
        </el-select>
        <a style="font-size: 14px; color: rgb(0 150 136); cursor: pointer" @click="onDeleteCategory(index)">删除</a>
      </el-form-item>

      <a
        v-if="!drawerProps.isView"
        style="display: block; margin-bottom: 15px; margin-left: 178px; font-size: 14px; color: rgb(0 150 136); cursor: pointer"
        @click="onAddCategory"
      >
        + 添加分类
      </a>

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
        <template #label>
          <span class="label-with-break" style="text-align: right">introduce_image<br />默认官网</span>
        </template>
        <UploadImg v-model:image-url="drawerProps.row!.introduce_image" height="140px" width="140px" :file-size="5">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传照片</span>
          </template>
          <template #tip> 照片大小不能超过 5M </template>
        </UploadImg>
      </el-form-item>

      <el-form-item label="introduce_video" prop="introduce_video">
        <template #label>
          <span class="label-with-break" style="text-align: right">introduce_video<br />默认官网</span>
        </template>
        <UploadVideo v-model:image-url="drawerProps.row!.introduce_video" height="140px" width="540px" :file-size="10">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传视频文件</span>
          </template>
          <template #tip> 视频大小不能超过 10M </template>
        </UploadVideo>
      </el-form-item>

      <el-form-item label="introduce_video_cover" prop="introduce_video_cover">
        <template #label>
          <span class="label-with-break" style="text-align: right">introduce_video_cover<br />默认官网</span>
        </template>
        <UploadImg v-model:image-url="drawerProps.row!.introduce_video_cover" height="140px" width="140px" :file-size="5">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传照片</span>
          </template>
          <template #tip> 照片大小不能超过 5M </template>
        </UploadImg>
      </el-form-item>

      <el-form-item label="introduce_image" prop="introduce_image_home" v-if="ai_platform == 2">
        <template #label>
          <span class="label-with-break" style="text-align: right">introduce_image<br />渠道官网</span>
        </template>
        <UploadImg v-model:image-url="drawerProps.row!.introduce_image_home" height="140px" width="140px" :file-size="5">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传照片</span>
          </template>
          <template #tip> 照片大小不能超过 5M </template>
        </UploadImg>
      </el-form-item>

      <el-form-item label="introduce_video" prop="introduce_video_home" v-if="ai_platform == 2">
        <template #label>
          <span class="label-with-break" style="text-align: right">introduce_video<br />渠道官网</span>
        </template>
        <UploadVideo v-model:image-url="drawerProps.row!.introduce_video_home" height="140px" width="540px" :file-size="10">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传视频文件</span>
          </template>
          <template #tip> 视频大小不能超过 10M </template>
        </UploadVideo>
      </el-form-item>

      <el-form-item label="introduce_video_cover" prop="introduce_video_cover_home" v-if="ai_platform == 2">
        <template #label>
          <span class="label-with-break" style="text-align: right">introduce_video_cover<br />渠道官网</span>
        </template>
        <UploadImg v-model:image-url="drawerProps.row!.introduce_video_cover_home" height="140px" width="140px" :file-size="5">
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

      <el-form-item label="introduce" prop="ai_desc">
        <el-input v-model="drawerProps.row!.ai_desc" type="textarea" :rows="3" placeholder="introduce" clearable></el-input>
      </el-form-item>

      <el-form-item label="一级标签" prop="common_tags" v-for="(common_tag, index) in saveParams.common_tags" :key="common_tag">
        <el-select v-model="saveParams.common_tags[index]">
          <el-option v-for="item in allTags" :key="item.id" :label="item.tag_name" :value="item.id" />
        </el-select>
        <a style="font-size: 14px; color: rgb(0 150 136); cursor: pointer" @click="onDeleteCommonTag(index)">删除</a>
      </el-form-item>

      <a
        v-if="!drawerProps.isView"
        style="display: block; margin-bottom: 15px; margin-left: 178px; font-size: 14px; color: rgb(0 150 136); cursor: pointer"
        @click="onAddCommonTag"
      >
        + 添加一级标签
      </a>

      <el-form-item label="虚拟人标签" prop="tags">
        <el-tag
          class="mx-1"
          :closable="!drawerProps.isView"
          effect="dark"
          v-for="(tag, index) in tags"
          :key="tag"
          @close="onDelTag(index)"
          style="margin-bottom: 10px"
        >
          {{ tag }}
        </el-tag>
        <template v-if="!drawerProps.isView">
          <el-input
            v-model="tagtxt"
            v-if="tags.length < 6"
            placeholder="请输入标签名"
            maxlength="20"
            style="width: 120px; margin-right: 10px"
          />
          <el-tag class="mx-1" style="" v-if="tags.length < 6" @click="onAddTag">添加标签</el-tag>
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

      <el-form-item label="开场白语音" prop="open_remark_img_audio">
        <UploadVoice v-model:image-url="drawerProps.row!.open_remark_img_audio" height="140px" width="540px" :file-size="10">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传音频文件</span>
          </template>
          <template #tip> 音频大小不能超过 10M </template>
        </UploadVoice>
      </el-form-item>

      <!-- <el-form-item label="是否发开场白图片" prop="open_remark_img_switch">
        <el-switch v-model="drawerProps.row!.open_remark_img_switch" />
      </el-form-item>
      <el-form-item label="开场白图片" prop="images">
        <UploadImg v-model:image-url="drawerProps.row!.open_remark_img" width="135px" height="135px" :file-size="3">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传照片</span>
          </template>
          <template #tip> 头像大小不能超过 3M </template>
        </UploadImg>
      </el-form-item> -->

      <el-form-item label="用户的选项A" prop="quick_word1">
        <el-input v-model="drawerProps.row!.quick_word1" type="textarea" :rows="3" placeholder="" clearable></el-input>
      </el-form-item>

      <el-form-item label="选项A的AI回复" prop="quick_resp1">
        <el-input v-model="drawerProps.row!.quick_resp1" type="textarea" :rows="3" placeholder="" clearable></el-input>
      </el-form-item>

      <el-form-item label="选项A的图片" prop="quick_img1">
        <UploadImgs2 v-model:file-list="saveParams.quick_pic1" :api="uploadFile" :limit="1" height="140px" width="140px">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传照片</span>
          </template>
        </UploadImgs2>
      </el-form-item>

      <el-form-item label="用户的选项B" prop="quick_word2">
        <el-input v-model="drawerProps.row!.quick_word2" type="textarea" :rows="3" placeholder="" clearable></el-input>
      </el-form-item>

      <el-form-item label="选项B的AI回复" prop="quick_resp2">
        <el-input v-model="drawerProps.row!.quick_resp2" type="textarea" :rows="3" placeholder="" clearable></el-input>
      </el-form-item>

      <el-form-item label="选项B的图片" prop="quick_img2">
        <UploadImgs2 v-model:file-list="saveParams.quick_pic2" :api="uploadFile" :limit="1" height="140px" width="140px">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传照片</span>
          </template>
        </UploadImgs2>
      </el-form-item>

      <el-form-item label="意图标签组" prop="Class">
        <!-- <el-select v-model="drawerProps.row!.intent_tag_id" placeholder="请选择">
          <el-option v-for="item in drawerProps.row!.intention" :key="item" :label="item" :value="item"> </el-option>
        </el-select> -->
        <el-tabs v-model="activeName" type="border-card" class="demo-tabs" @tab-change="getIntentTags()">
          <el-tab-pane v-for="item in drawerProps.row!.intention" :key="item" :label="item" :name="item">
            <!-- <el-radio-group v-model="recognitionList[item + '_value']">
              <el-radio v-for="items in recognitionList[item]" :key="items" :label="items.collection">{{ items.name }}</el-radio>
            </el-radio-group> -->
            <el-select v-model="recognitionList[item]" clearable placeholder="请选择组名称">
              <el-option
                v-for="items in recognitionList[item + '_list']"
                :key="items"
                :label="items.name"
                :value="items.collection"
              />
            </el-select>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>

      <el-form-item label="是否开启大尺度语音" prop="large_scale_open">
        <el-switch v-model="drawerProps.row!.large_scale_open" />
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
        <!-- <el-checkbox
          v-model="drawerProps.row!.drama_date_btn_show"
          :checked="drawerProps.row!.drama_date_btn_show == 1"
          label="剧情模式"
          size="large"
        /> -->
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
      <el-form-item label="是否置顶" prop="is_top">
        <el-radio-group v-model="drawerProps.row!.is_top">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Weight" prop="weight">
        <el-input v-model="drawerProps.row!.weight" placeholder="weight" clearable></el-input>
      </el-form-item>
      <!-- <el-form-item label="置顶权重" prop="weight" v-if="drawerProps.row!.is_top">
        <el-input
          v-model="drawerProps.row!.weight"
          placeholder="作为置顶的角色的排序依依据，数大的在前"
          type="number"
          clearable
        ></el-input>
      </el-form-item> -->
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false"> 取消 </el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit"> 确定1 </el-button>
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
import { ElMessage, FormInstance } from "element-plus";
import { User } from "@/api/interface";
import { getLoraList, addLora, delLora, intentTags } from "@/api/prompt";
import UploadImg from "@/components/Upload/Img.vue";
import UploadVoice from "@/components/Upload/voice.vue";
import UploadVideo from "@/components/Upload/video.vue";
import UploadImgs from "@/components/Upload/Imgs.vue";
import UploadImgs2 from "@/components/Upload/Imgs.vue"; // UploadImgs2 组件可以预览图库的图片数据结构
import { uploadFile, savePic } from "@/api/gallery";
import { useRoute } from "vue-router";
import { getAllTags, getAllCategories } from "@/api/label";

const route = useRoute();

// 0:ios(web) 1:android 2:web大尺度 3:web
let ai_platform = 0;
if (route.name === "virtualHuman2") {
  ai_platform = 1;
} else if (route.name === "virtualHuman3") {
  ai_platform = 2;
} else if (route.name === "virtualHuman4") {
  ai_platform = 3;
}

/**
 * 若配置6项中的1项，则其他5项也必填
 * @param rule
 * @param value
 * @param callback
 */
const checkQuick = (rule: any, value: any, callback: any) => {
  if (
    [
      drawerProps.value.row.quick_word1,
      drawerProps.value.row.quick_resp1,
      drawerProps.value.row.quick_word2,
      drawerProps.value.row.quick_resp2
    ].some(i => !!i) ||
    [saveParams.value.quick_pic1, saveParams.value.quick_pic1].some(img => img.length > 0)
  ) {
    if (["quick_word1", "quick_resp1", "quick_word2", "quick_word2"].includes(rule.field) && value === "") {
      return callback("当前配置项必填");
    }
    if (rule.field === "quick_img1" && saveParams.value.quick_pic1.length === 0) {
      return callback("当前配置项必填");
    }
    if (rule.field === "quick_img2" && saveParams.value.quick_pic2.length === 0) {
      return callback("当前配置项必填");
    }
  }
  return callback();
};

const rules = reactive({
  // name: [{ required: true, message: "请输入用户名" }],
  // sex: [{ required: true, message: "请选择性别" }]
  quick_word1: [{ required: false, validator: checkQuick, trigger: "blur" }],
  quick_resp1: [{ required: false, validator: checkQuick, trigger: "blur" }],
  quick_img1: [{ required: false, validator: checkQuick, trigger: "blur" }],
  quick_word2: [{ required: false, validator: checkQuick, trigger: "blur" }],
  quick_resp2: [{ required: false, validator: checkQuick, trigger: "blur" }],
  quick_img2: [{ required: false, validator: checkQuick, trigger: "blur" }]
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

// watch(
//   () => drawerProps.value.row!.intent_tag_id,
//   value => {
//     if (drawerProps.value.row!.intent_tag_id != "") {
//       getIntentTags();
//     }
//   }
// );

const newDataIndex = ref([]);
const centerDialogVisible = ref(false);

const activeName = ref();
const recognitionList = ref({});

const saveParams = ref({
  quick_pic1: [],
  quick_pic2: [],
  ai_uid: "",
  pic_level: 0,
  common_tags: [""], // 一级标签
  categories: [""] // 分类
});

const handleClose = (params: DrawerProps) => {
  saveParams.value.quick_pic1 = [];
  saveParams.value.quick_pic2 = [];
  saveParams.value.ai_uid = "";
  saveParams.value.pic_level = 0;
  drawerProps.value.isView = false;
  drawerProps.value.title = "";
  drawerProps.value.row = {};
  activeName.value = "";
  recognitionList.value = {};
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

const allTags = ref();
const allCategories = ref();
const init = async () => {
  const [tags, categories] = await Promise.all([getAllTags(), getAllCategories()]);
  allTags.value = tags.data || [];
  allCategories.value = categories.data || [];
};

const acceptParams = (params: DrawerProps) => {
  saveParams.value.quick_pic1 =
    params.row.quick_pic1 && Object.keys(params.row.quick_pic1).length ? [{ url: params.row.quick_pic1.pic_source_url }] : [];
  saveParams.value.quick_pic2 =
    params.row.quick_pic2 && Object.keys(params.row.quick_pic2).length ? [{ url: params.row.quick_pic2.pic_source_url }] : [];
  saveParams.value.ai_uid = params.row.ai_uid;
  saveParams.value.pic_level = 0;
  saveParams.value.common_tags = params.row.common_tag_ids?.length ? params.row.common_tag_ids : [""];
  saveParams.value.categories = params.row.category_ids?.length ? params.row.category_ids : [""];
  drawerProps.value = params;
  // console.log("drawerProps", params.generatePhotModel);
  drawerProps.value.row.images = [];
  if (drawerProps.value.row.posters) {
    drawerProps.value.row.posters.forEach((element: any) => {
      drawerProps.value.row.images.push({
        name: "1",
        url: element
      });
    });
  }
  activeName.value = "";
  recognitionList.value = {};
  tags.value = params.row.tags || [];
  drawerProps.value.row.private_date_btn = drawerProps.value.row.private_date_btn == "1" ? true : false;
  drawerProps.value.row.role_play_btn = drawerProps.value.row.role_play_btn == "1" ? true : false;
  drawerProps.value.row.generate_photo_btn = drawerProps.value.row.generate_photo_btn == "1" ? true : false;
  drawerProps.value.row.selfie_btn_show = drawerProps.value.row.selfie_btn_show == "1" ? true : false;
  drawerProps.value.row!.drama_date_btn_show = drawerProps.value.row!.drama_date_btn_show == "1" ? true : false;
  drawerProps.value.row.large_scale_open = drawerProps.value.row.large_scale_open == "1" ? true : false;
  drawerProps.value.row.open_remark_img_switch = drawerProps.value.row.open_remark_img_switch == "1" ? true : false;
  drawerProps.value.row!.is_top = drawerProps.value.row!.is_top == 1 ? 1 : 0;

  drawerVisible.value = true;
  getLoraListApi(false);
  if (drawerProps.value.row.intent_recognition_list == "") {
    activeName.value = drawerProps.value.row!.intention[0];
    getIntentTags();
  } else {
    activeName.value = drawerProps.value.row!.intention[0];
    getIntentTags();
    drawerProps.value.row!.intent_recognition_list.forEach(element => {
      recognitionList.value[element.intention] = element.collection;
    });
  }

  init();
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

const getIntentTags = () => {
  if (recognitionList.value[activeName.value + "_list"]) {
    return false;
  }
  const params = {
    intent: activeName.value
  };
  intentTags(params).then((res: any) => {
    if (res.code == 200) {
      recognitionList.value[activeName.value + "_list"] = [];
      recognitionList.value[activeName.value + "_list"] = res.data;
      if (!recognitionList.value[activeName.value]) {
        recognitionList.value[activeName.value] = "";
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

const onAddCommonTag = () => {
  saveParams.value.common_tags.push("");
};
const onDeleteCommonTag = (index: number) => {
  saveParams.value.common_tags.splice(index, 1);
};
const onAddCategory = () => {
  saveParams.value.categories.push("");
};
const onDeleteCategory = (index: number) => {
  saveParams.value.categories.splice(index, 1);
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  const intent_recognition_list = ref([]);
  for (const key in recognitionList.value) {
    if (typeof recognitionList.value[key] === "string") {
      if (recognitionList.value[key] != "") {
        console.log("element", key, recognitionList.value[key]);
        intent_recognition_list.value.push({
          intention: key,
          collection: recognitionList.value[key]
        });
      }
    }
  }
  if (drawerProps.value.row.ai_name == "") {
    ElMessage.error("请输入姓名");
    return false;
  }
  if (drawerProps.value.row.create_by == "") {
    ElMessage.error("请输入create_by");
    return false;
  }
  // if (drawerProps.value.row.ai_class == "") {
  //   ElMessage.error("请选择class");
  //   return false;
  // }
  drawerProps.value.row.name = drawerProps.value.row.ai_name;
  drawerProps.value.row.private_date_btn = drawerProps.value.row.private_date_btn ? "1" : "0";
  drawerProps.value.row.role_play_btn = drawerProps.value.row.role_play_btn ? "1" : "0";
  drawerProps.value.row.generate_photo_btn = drawerProps.value.row.generate_photo_btn ? "1" : "0";
  drawerProps.value.row.selfie_btn_show = drawerProps.value.row.selfie_btn_show ? "1" : "0";
  drawerProps.value.row.large_scale_open = drawerProps.value.row.large_scale_open ? "1" : "0";
  drawerProps.value.row.open_remark_img_switch = drawerProps.value.row.open_remark_img_switch ? "1" : "0";
  drawerProps.value.row.intent_recognition_list = intent_recognition_list;
  drawerProps.value.row!.drama_date_btn_show = drawerProps.value.row!.drama_date_btn_show ? "1" : "0";
  drawerProps.value.row.posters = [];
  drawerProps.value.row.images.forEach((element: { url: any }) => {
    drawerProps.value.row.posters.push(element.url);
  });

  drawerProps.value.row.common_tag_ids = Array.from(new Set(saveParams.value.common_tags.filter(t => !!t)));
  drawerProps.value.row.category_ids = Array.from(new Set(saveParams.value.categories.filter(t => !!t)));

  ruleFormRef.value!.validate(async valid => {
    if (!valid) {
      return;
    }
    try {
      // @tips：首先上传 AI 收费图片。
      if (saveParams.value.quick_pic1.length && saveParams.value.quick_pic2.length) {
        let images: any[] = [];
        // @tips：看看有没有变化。
        const npic1 = (saveParams.value.quick_pic1[0] as any).url.pic_source_url;
        const opic1 = drawerProps.value.row.quick_pic1?.pic_source_url;
        if (opic1 !== npic1) images.push(saveParams.value.quick_pic1[0]);
        const npic2 = (saveParams.value.quick_pic2[0] as any).url.pic_source_url;
        const opic2 = drawerProps.value.row.quick_pic2?.pic_source_url;
        if (opic2 !== npic2) images.push(saveParams.value.quick_pic2[0]);
        images = images.map(img => ({ pic_source_url: img.url.pic_source_url, pic_fuzzy_url: img.url.pic_fuzzy_url })) as any[];
        const {
          data: { pic_ids = [] }
        } = (await savePic({
          images,
          pic_level: saveParams.value.pic_level,
          ai_uid: saveParams.value.ai_uid,
          ai_platform
        })) as any;
        if (pic_ids.length === 2) {
          drawerProps.value.row.quick_img1 = parseInt(pic_ids[0]);
          drawerProps.value.row.quick_img2 = parseInt(pic_ids[1]);
        } else if (pic_ids.length === 1 && opic1 !== npic1) {
          drawerProps.value.row.quick_img1 = parseInt(pic_ids[0]);
        } else if (pic_ids.length === 1 && opic2 !== npic2) {
          drawerProps.value.row.quick_img2 = parseInt(pic_ids[0]);
        }
      }
      // @tips：清空 quick 配置的情况。
      if (!saveParams.value.quick_pic1.length && !saveParams.value.quick_pic2.length) {
        drawerProps.value.row.quick_img1 = 0;
        drawerProps.value.row.quick_img2 = 0;
      }
      // @tips：更新 moment 配置。
      const params = {
        ...drawerProps.value.row,
        tags: tags.value,
        weight: isNaN(drawerProps.value.row.weight) ? undefined : Number(drawerProps.value.row.weight),
        ai_platform
      };
      const res = await drawerProps.value.api!(params);
      if (res.code == "200") {
        ElMessage.success({ message: `${drawerProps.value.title}成功！` });
        drawerProps.value.getTableList!();
        // drawerVisible.value = false;
        handleClose();
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
.demo-tabs {
  overflow: hidden;
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
