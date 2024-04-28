<template>
  <div class="prompt">
    <el-button type="primary" style="margin-bottom: 12px" icon="ArrowLeft" @click="goBack">返回</el-button>
    <p style="margin-left: 150px">
      <el-text class="mx-1" type="danger">模板类型为c.ai 模型类型只能选择c.ai 选其他类型不生效</el-text>
    </p>
    <VueDraggable ref="el" v-model="dataProps" @update="onUpdate">
      <div class="main" v-for="(item, index) in dataProps" :key="index">
        <div class="title">模型{{ title[index] }}</div>
        <el-form ref="ruleFormRef" label-width="150px" label-suffix=" :">
          <el-form-item label="模型选择" prop="llm_type">
            <el-select v-model="item.llm_type" placeholder="请选择" clearable>
              <el-option v-for="item_2 in modeList" :key="item_2.value" :label="item_2.label" :value="item_2.value"> </el-option>
            </el-select>
          </el-form-item>
          <!-- System模板选择 -->
          <div class="template flex">
            <div class="item">
              <el-form-item label="System模板选择" prop="template_name">
                <el-select
                  v-model="item.prompt_template_id"
                  @change="getTemplateSystem(item, index)"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="item_2 in system_templateList"
                    :key="item_2.value"
                    :label="item_2.template_name"
                    :value="item_2.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <system ref="systemRef" :key="componentKey"></system>
            </div>
            <div class="item">
              <el-form-item label="Usersay模板选择" prop="user_template_id">
                <el-select
                  v-model="item.user_template_id"
                  @change="getTemplateUsersay(item, index)"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="item_2 in usersay_templateList"
                    :key="item_2.value"
                    :label="item_2.template_name"
                    :value="item_2.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <usersay ref="usersayRef" :key="componentKey"></usersay>
            </div>
          </div>
          <!-- end System模板选择 -->
        </el-form>
      </div>
    </VueDraggable>
    <div class="btn">
      <el-button type="primary" style="margin-bottom: 12px" @click="submit()" :disabled="route.query.is_view === '1'">
        提交模型
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="prompt">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ref, reactive, nextTick, onMounted } from "vue";
import { templateType, getTemplateList, getVariableList } from "@/api/prompt";
import { ElMessage, FormInstance } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { VueDraggable } from "vue-draggable-plus";
import system from "./components/system.vue";
import usersay from "./components/usersay.vue";
// import system from "./components/system.vue";
// import usersay from "./components/usersay.vue";
import { saveAiUserPrompt } from "@/api/prompt";
import { usePromptStore } from "@/stores/modules/prompt";
import { fa } from "element-plus/es/locale";
import { episodePrompt, saveEpisodePromptList } from "@/api/playConfig/play";
const usePrompt = usePromptStore();

const route = useRoute();
const router = useRouter();
const componentKey = ref("");

const title = ref<any>({
  0: "一",
  1: "二"
});
const modeList = [
  {
    value: "openai",
    label: "ChatGPT3.5 16K"
  },
  {
    value: "rp",
    label: "RP-1111"
  },
  {
    value: "c.ai",
    label: "c.ai"
  },
  {
    value: "8onfHfKu",
    label: "8onfHfKu"
  }
];
const system_templateList = ref([]);
const usersay_templateList = ref([]);
const templateList = ref([]);
const variableList = ref([]);

// 目前只有模型一和模型二
const dataProps = ref<any>([
  {
    prompt_template: "",
    prompt_vars: {},
    prompt_template_id: "",
    llm_type: "",
    user_say_template: "",
    user_template_id: "",
    user_say_vars: {}
  },
  {
    prompt_template: "",
    prompt_vars: {},
    prompt_template_id: "",
    llm_type: "",
    user_say_template: "",
    user_template_id: "",
    user_say_vars: {}
  }
]);

const onUpdate = () => {
  componentKey.value = Math.random();
  setTimeout(() => {
    dataProps.value.forEach((element, index) => {
      getTemplateSystem(element, index, false);
      getTemplateUsersay(element, index, false);
    });
  }, 50);
};

const systemRef = ref<InstanceType<typeof system> | null>(null);
//添加
const getTemplateSystem = (row?: {}, index: any, isRefresh = true) => {
  const params = {
    isView: true,
    row: row,
    templateList: templateList,
    variableList: variableList,
    isRefresh: isRefresh
  };
  systemRef.value[index]?.acceptParams(params);
};
const usersayRef = ref<InstanceType<typeof usersay> | null>(null);
const getTemplateUsersay = (row?: {}, index: any) => {
  const params = {
    isView: true,
    row: row,
    templateList: templateList,
    variableList: variableList
  };
  usersayRef.value[index]?.acceptParams(params);
};

const getTempList = (row: any) => {
  getTemplateList().then(res => {
    if (res.code == 200) {
      templateList.value = res.data.list;
      res.data.list.forEach(element => {
        if (element.template_type == "system") {
          system_templateList.value.push(element);
        }
        if (element.template_type == "user_say") {
          usersay_templateList.value.push(element);
        }
      });
      setTimeout(() => {
        let prompt_list = [];
        // @tips：创建 moment 的时候会继承 ai 的 prompt_list 配置。
        if (route.query.moment_id && usePrompt.momentInfo.episode_prompt_list) {
          prompt_list = JSON.parse(usePrompt.momentInfo.episode_prompt_list);
        }
        if (!route.query.moment_id && usePrompt.info.prompt_list) {
          prompt_list = usePrompt.info.prompt_list;
        }
        prompt_list.forEach((element, index) => {
          dataProps.value[index] = element;
          getTemplateSystem(element, index);
          getTemplateUsersay(element, index);
        });
      }, 1000);
    }
  });
};
const getList = (row: any) => {
  getVariableList({ page: 1, pageSize: 1000 }).then(res => {
    if (res.code == 200) {
      variableList.value = res.data.list;
    }
  });
};

const submit = async () => {
  // usePrompt.isSystem = false;
  // usePrompt.isUsersay = false;
  // usePrompt.isMessage = true;
  let arr = [];
  dataProps.value.forEach(async (element, index) => {
    if (element.llm_type != "") {
      if (element.prompt_template_id == "") {
        ElMessage.error({ message: `请选择System模板` });
        return false;
      }
      await systemRef.value[index]?.getResultPrompt();
      await usersayRef.value[index]?.getResultPrompt();
    } else {
      if (index == 0) {
        ElMessage.error({ message: `请选择一个模型` });
      }
    }
    arr.push(index);
    if (dataProps.value.length == arr.length) {
      // if (usePrompt.isSystem && usePrompt.isUsersay) {
      submitTemplate();
      // }
    }
  });
  // setTimeout(() => {
  //   if (usePrompt.isSystem && usePrompt.isUsersay && isData) {
  //     submitTemplate();
  //   }
  // }, 1300);
};

const submitTemplate = async () => {
  const _update_ai = async () => {
    try {
      await saveAiUserPrompt({
        prompt_list: dataProps.value,
        ai_uid: route.query.ai_uid
      });
      ElMessage.success({ message: `模板成功！` });
    } catch (error) {
      console.log(error);
    }
  };
  const _update_moment = async () => {
    try {
      const params = {
        prompt_list: dataProps.value,
        id: route.query.moment_id
      };
      await saveEpisodePromptList(params);
      ElMessage.success({ message: `模板成功！` });
    } catch (error) {
      console.log(error);
    }
  };
  if (route.query.moment_id) return await _update_moment();
  return await _update_ai();
};

// onMounted(() => {
const init = async () => {
  await getTempList();
  await getList();
};
init();

function goBack() {
  router.go(-1);
}
// });
</script>
<style lang="scss">
.prompt {
  box-sizing: border-box;
  padding: 20px;
  overflow-x: hidden;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  box-shadow: 0 0 12px #0000000d;
  .title {
    padding: 14px 16px;
    margin-bottom: 20px;
    font-size: 16px;
  }
  .main {
    border-bottom: 1px solid var(--el-border-color-light);
  }
  .template {
    justify-content: flex-start;
    .item {
      width: 600px;
    }
  }
  .btn {
    margin-top: 20px;
  }
}
</style>
