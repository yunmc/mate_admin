<template>
  <el-drawer v-model="drawerVisible" size="780px" title="Moment配置" :destroy-on-close="true" @before-close="beforeCloseDrawer">
    <el-form
      ref="ruleFormRef"
      label-width="208px"
      label-suffix=" :"
      :disabled="drawerProps.isView"
      :rules="rules"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <div class="title">信息配置</div>

      <el-form-item label="AI昵称" prop="ai_name">
        <el-select v-model="drawerProps.row!.episode_ai_uid" placeholder="请选择">
          <el-option v-for="item in aiUserList" :key="item.ai_uid" :label="item.ai_name" :value="item.ai_uid"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Moment名字（内部）" prop="episode_alias">
        <el-input v-model="drawerProps.row!.episode_alias" placeholder="" clearable></el-input>
      </el-form-item>

      <el-form-item label="排序" prop="episode_sort">
        <el-input v-model="drawerProps.row!.episode_sort" placeholder="" type="number" clearable></el-input>
      </el-form-item>

      <el-form-item label="关键字" prop="episode_title">
        <el-input v-model="drawerProps.row!.episode_title" placeholder="" clearable></el-input>
      </el-form-item>

      <el-form-item label="Moment介绍" prop="episode_background">
        <el-input v-model="drawerProps.row!.episode_background" type="textarea" :rows="3" placeholder="" clearable></el-input>
      </el-form-item>

      <el-form-item label="Moment封面图" prop="episode_main_image">
        <UploadImg v-model:image-url="drawerProps.row!.episode_main_image" width="135px" height="135px" :file-size="1">
          <template #empty>
            <el-icon><Avatar /></el-icon>
            <span>请选择上传图片</span>
          </template>
        </UploadImg>
      </el-form-item>

      <el-form-item label="Moment卡片图" prop="episode_thumbnail">
        <UploadImg v-model:image-url="drawerProps.row!.episode_thumbnail" width="135px" height="135px" :file-size="3">
          <template #empty>
            <el-icon><Avatar /></el-icon>
            <span>请选择上传图片</span>
          </template>
        </UploadImg>
      </el-form-item>

      <el-form-item label="是否在首页展示这张卡片" prop="episode_default">
        <el-radio-group v-model="drawerProps.row!.episode_default">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="聊天背景图" prop="episode_bg_image">
        <UploadImg v-model:image-url="drawerProps.row!.episode_bg_image" width="135px" height="135px" :file-size="3">
          <template #empty>
            <el-icon><Avatar /></el-icon>
            <span>请选择上传图片</span>
          </template>
        </UploadImg>
      </el-form-item>

      <el-form-item label="人物默认立绘" prop="episode_emotions_default">
        <UploadImgs v-model:file-list="drawerProps.row!.episode_emotions.default" :limit="9" height="140px" width="140px">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传照片</span>
          </template>
          <template #tip> 最多上传 9 张照片 </template>
        </UploadImgs>
      </el-form-item>

      <!-- 情绪立绘开始 -->

      <el-form-item label="情绪1（happy/快乐）立绘" prop="episode_emotions_happy">
        <UploadImgs v-model:file-list="drawerProps.row!.episode_emotions.happy" :limit="9" height="140px" width="140px">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传照片</span>
          </template>
          <template #tip> 最多上传 9 张照片 </template>
        </UploadImgs>
      </el-form-item>

      <el-form-item label="情绪2（fearful/害怕）立绘" prop="episode_emotions_fearful">
        <UploadImgs v-model:file-list="drawerProps.row!.episode_emotions.fearful" :limit="9" height="140px" width="140px">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传照片</span>
          </template>
          <template #tip> 最多上传 9 张照片 </template>
        </UploadImgs>
      </el-form-item>

      <el-form-item label="情绪3（sad/悲伤）立绘" prop="episode_emotions_sad">
        <UploadImgs v-model:file-list="drawerProps.row!.episode_emotions.sad" :limit="9" height="140px" width="140px">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传照片</span>
          </template>
          <template #tip> 最多上传 9 张照片 </template>
        </UploadImgs>
      </el-form-item>

      <el-form-item label="情绪4（arrogant/傲慢）立绘" prop="episode_emotions_arrogant">
        <UploadImgs v-model:file-list="drawerProps.row!.episode_emotions.arrogant" :limit="9" height="140px" width="140px">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传照片</span>
          </template>
          <template #tip> 最多上传 9 张照片 </template>
        </UploadImgs>
      </el-form-item>

      <el-form-item label="情绪5（angry/生气）立绘" prop="episode_emotions_angry">
        <UploadImgs v-model:file-list="drawerProps.row!.episode_emotions.angry" :limit="9" height="140px" width="140px">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传照片</span>
          </template>
          <template #tip> 最多上传 9 张照片 </template>
        </UploadImgs>
      </el-form-item>

      <el-form-item label="情绪6（shy/害羞）立绘" prop="episode_emotions_shy">
        <UploadImgs v-model:file-list="drawerProps.row!.episode_emotions.shy" :limit="9" height="140px" width="140px">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传照片</span>
          </template>
          <template #tip> 最多上传 9 张照片 </template>
        </UploadImgs>
      </el-form-item>

      <el-form-item label="情绪7（tempting/诱人）立绘" prop="episode_emotions_tempting">
        <UploadImgs v-model:file-list="drawerProps.row!.episode_emotions.tempting" :limit="9" height="140px" width="140px">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传照片</span>
          </template>
          <template #tip> 最多上传 9 张照片 </template>
        </UploadImgs>
      </el-form-item>

      <el-form-item label="情绪8（hot/高潮）立绘" prop="episode_emotions_hot">
        <UploadImgs v-model:file-list="drawerProps.row!.episode_emotions.hot" :limit="9" height="140px" width="140px">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传照片</span>
          </template>
          <template #tip> 最多上传 9 张照片 </template>
        </UploadImgs>
      </el-form-item>

      <!-- 情绪立绘结束 -->

      <div class="title">类型配置</div>

      <el-form-item label="Moment类型" prop="episode_mode">
        <el-select v-model="drawerProps.row!.episode_mode" placeholder="请选择">
          <el-option v-for="item in momentTypeList" :key="item.stateLabel" :label="item.stateLabel" :value="item.stateValue">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="drawerProps.row!.episode_mode == 2" label="Challenge介绍" prop="episode_task_desc">
        <el-input v-model="drawerProps.row!.episode_task_desc" type="textarea" :rows="3" placeholder="" clearable></el-input>
      </el-form-item>

      <el-form-item v-if="drawerProps.row!.episode_mode == 2" label="关卡对话轮次" prop="episode_chat_round">
        <el-input v-model="drawerProps.row!.episode_chat_round" placeholder="" type="number" clearable></el-input>
      </el-form-item>

      <el-form-item v-if="drawerProps.row!.episode_mode == 2" label="关卡挑战次数" prop="episode_challenge_times">
        <el-input v-model="drawerProps.row!.episode_challenge_times" placeholder="" clearable></el-input>
      </el-form-item>

      <el-form-item v-if="drawerProps.row!.episode_mode == 2" label="重新挑战需金币" prop="episode_done_coin">
        <el-input v-model="drawerProps.row!.episode_done_coin" placeholder="" type="number" clearable></el-input>
      </el-form-item>

      <div class="title">对话设置</div>

      <el-form-item label="开场白" prop="episode_remarks">
        <el-input v-model="drawerProps.row!.episode_remarks" type="textarea" :rows="3" placeholder="" clearable></el-input>
      </el-form-item>

      <el-form-item label="是否发开场白图片" prop="episode_remarks_img_switch">
        <el-switch v-model="drawerProps.row!.episode_remarks_img_switch" />
      </el-form-item>

      <el-form-item label="开场白语音" prop="episode_remarks_audio">
        <UploadVoice v-model:image-url="drawerProps.row!.episode_remarks_audio" height="140px" width="540px" :file-size="10">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传音频文件</span>
          </template>
          <template #tip> 音频大小不能超过 10M </template>
        </UploadVoice>
      </el-form-item>

      <el-form-item label="开场白图片" prop="episode_remarks_img">
        <UploadImg v-model:image-url="drawerProps.row!.episode_remarks_img" width="135px" height="135px" :file-size="5">
          <template #empty>
            <el-icon><Avatar /></el-icon>
            <span>请选择上传图片</span>
          </template>
        </UploadImg>
      </el-form-item>

      <div class="title">状态设置</div>

      <el-form-item label="是否上线" prop="episode_online_state">
        <el-switch v-model="drawerProps.row!.episode_online_state" />
      </el-form-item>

      <el-form-item label="是否会员" prop="episode_pro">
        <el-radio-group v-model="drawerProps.row!.episode_pro">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="是否付费" prop="episode_pay">
        <el-radio-group v-model="drawerProps.row!.episode_pay">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="drawerProps.row!.episode_pay" label="解锁需金币" prop="episode_pay_coin">
        <el-input v-model="drawerProps.row!.episode_pay_coin" placeholder="" type="number" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false"> 取消 </el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit"> 确定 </el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="MomentEditDrawer">
import { ref, reactive, watch } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import UploadImg from "@/components/Upload/Img.vue";
import UploadImgs from "@/components/Upload/uploads.vue";
import UploadVoice from "@/components/Upload/voice.vue";
import { getPicList } from "@/api/gallery";

interface DrawerProps {
  row: any;
  isView: boolean;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  row: {},
  isView: false
});

const rules = reactive({});

const momentTypeList = [
  { stateLabel: "默认", stateValue: 0 },
  { stateLabel: "普通模式", stateValue: 1 },
  { stateLabel: "剧情挑战", stateValue: 2 }
];

const aiUserList = ref();
const init = async () => {
  // @tips：拉一下 ai 人列表。
  const resp: any = await getPicList({ page: 1, pageSize: 1, search: true });
  if (resp.code == 200) {
    aiUserList.value = resp.data;
  }
};
init();

const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerProps.value.row!.episode_online_state = drawerProps.value.row!.episode_online_state == 1 ? true : false;
  drawerProps.value.row!.episode_remarks_img_switch = drawerProps.value.row!.episode_remarks_img_switch == 1 ? true : false;
  drawerProps.value.row!.episode_emotions = drawerProps.value.row!.episode_emotions || {};
  drawerProps.value.row!.episode_emotions.happy = drawerProps.value.row!.episode_emotions.happy || [];
  drawerProps.value.row!.episode_emotions.fearful = drawerProps.value.row!.episode_emotions.fearful || [];
  drawerProps.value.row!.episode_emotions.sad = drawerProps.value.row!.episode_emotions.sad || [];
  drawerProps.value.row!.episode_emotions.arrogant = drawerProps.value.row!.episode_emotions.arrogant || [];
  drawerProps.value.row!.episode_emotions.angry = drawerProps.value.row!.episode_emotions.angry || [];
  drawerProps.value.row!.episode_emotions.shy = drawerProps.value.row!.episode_emotions.shy || [];
  drawerProps.value.row!.episode_emotions.tempting = drawerProps.value.row!.episode_emotions.tempting || [];
  drawerProps.value.row!.episode_emotions.hot = drawerProps.value.row!.episode_emotions.hot || [];
  drawerVisible.value = true;
};

const ruleFormRef = ref<FormInstance>();
const handleSubmit = async () => {
  ruleFormRef.value!.validate(async valid => {
    drawerProps.value.row!.episode_online_state = drawerProps.value.row!.episode_online_state ? 1 : 0;
    drawerProps.value.row!.episode_remarks_img_switch = drawerProps.value.row!.episode_online_state ? 1 : 0;
    Object.keys(drawerProps.value.row.episode_emotions).forEach(k => {
      let emotion = drawerProps.value.row.episode_emotions[k];
      if (!Array.isArray(emotion)) emotion = [emotion];
      drawerProps.value.row.episode_emotions[k] = emotion.filter((i: any) => i.url).map((i: any) => ({ url: i.url, weight: 1 }));
    });
    if (!valid) {
      return;
    }
    try {
      const params = {
        ...drawerProps.value.row
      };
      const res = await drawerProps.value.api!(params);
      if (res.code == "200") {
        ElMessage.success({ message: `提交成功！` });
        drawerProps.value.getTableList!();
        drawerVisible.value = false;
      } else {
        ElMessage.warning({ message: res.msg });
      }
    } catch (e) {
      ElMessage.warning({ message: (e as any).toString() });
    }
  });
};
const beforeCloseDrawer = () => {
  drawerProps.value.isView = false;
  drawerProps.value.row = {};
  drawerVisible.value = false;
};

defineExpose({
  acceptParams
});
</script>

<style lang="scss" scoped>
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
