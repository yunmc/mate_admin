<template>
  <div class="prompt">
    <el-button type="primary" style="margin-bottom: 12px" icon="ArrowLeft" @click="goBack">返回</el-button>
    <div class="main" v-for="(item, index) in dataProps" :key="index">
      <div class="title">模型一</div>
      <el-form ref="ruleFormRef" label-width="150px" label-suffix=" :" :rules="rules" :disabled="item.isView">
        <el-form-item label="模型选择" prop="llm_type">
          <el-select v-model="item.llm_type" placeholder="请选择">
            <el-option v-for="item_2 in modeList" :key="item_2.value" :label="item_2.label" :value="item_2.value"> </el-option>
          </el-select>
        </el-form-item>
        <!-- System模板选择 -->
        <el-form-item label="System模板选择" prop="template_name">
          <el-select v-model="item.prompt_template_id" @change="getTemplate(item, index)" placeholder="请选择">
            <el-option v-for="item_2 in system_templateList" :key="item_2.value" :label="item_2.template_name" :value="item_2.id">
            </el-option>
          </el-select>
        </el-form-item>
        <system ref="systemRef"></system>
        <!-- end System模板选择 -->
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts" name="prompt">
import { ref, reactive, nextTick } from "vue";
import { templateType, getTemplateList, getVariableList } from "@/api/prompt";
import system from "./components/system.vue";
const modeList = [
  {
    value: "openai",
    label: "ChatGPT3.5 16K"
  },
  {
    value: "rp",
    label: "RP-1111"
  }
];

const system_templateList = ref([]);
const usersay_templateList = ref([]);
const templateList = ref([]);
const variableList = ref([]);

const dataProps = reactive([
  {
    prompt_template: "",
    prompt_vars: [],
    prompt_template_id: "",
    llm_type: ""
  },
  {
    prompt_template: "",
    prompt_vars: [],
    prompt_template_id: "",
    llm_type: ""
  }
]);

const systemRef = ref<InstanceType<typeof system> | null>(null);
//添加
const getTemplate = (row?: {}, index: string) => {
  const params = {
    isView: true,
    row: row,
    templateList: templateList,
    variableList: variableList
  };
  systemRef.value[index]?.acceptParams(params);
};

const getTempList = (row: Partial<variableType>) => {
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
    }
  });
};
getTempList();

const getList = (row: Partial<variableType>) => {
  getVariableList({ page: 1, pageSize: 1000 }).then(res => {
    if (res.code == 200) {
      variableList.value = res.data.list;
    }
  });
};

getList();
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
}
</style>
