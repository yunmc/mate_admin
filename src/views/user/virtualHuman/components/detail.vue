<template>
  <div class="template">
    <el-dialog
      v-model="drawerVisible"
      :title="`${drawerProps.title}`"
      :destroy-on-close="true"
      width="65%"
      @before-close="handleClose"
      @close="handleClose"
    >
      <div class="flex main">
        <el-form
          ref="ruleFormRef"
          label-width="130px"
          label-suffix=" :"
          :rules="rules"
          :disabled="drawerProps.isView"
          :model="drawerProps.row"
          :hide-required-asterisk="drawerProps.isView"
        >
          <el-form-item label="模型选择" prop="llm_type">
            <el-select v-model="drawerProps.row!.llm_type" placeholder="请选择">
              <el-option v-for="item in modeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="System模板选择" prop="template_name">
            <el-select
              :class="{'template_select':drawerProps.row!.prompt_template_id == -1}"
              v-model="drawerProps.row!.prompt_template_id"
              @change="getTemplate(drawerProps.row!.prompt_template_id, 'system')"
              placeholder="请选择"
            >
              <el-option v-for="item in system_templateList" :key="item.value" :label="item.template_name" :value="item.id">
              </el-option>
            </el-select>
            <el-button :type="drawerProps.row!.prompt_template_id == -1 ? 'primary' : ''" link @click="stopTemplate">
              不用模版--自定义
            </el-button>
          </el-form-item>
          <el-form-item
            v-if="drawerProps.row!.prompt_template_id"
            :label="drawerProps.row!.prompt_template_id == -1 ? 'Promot填写': '变量填写'"
            prop="content"
          >
            <div style="width: 100%" v-if="drawerProps.row!.prompt_template_id != -1" contenteditable="false">
              <div class="list" v-for="item in system_template_check" :key="item.id">
                <el-tag type="success">{{ item.variable_name }} | {{ item.variable_cname }}</el-tag>
                <el-input v-model="item.value" placeholder="请输入" contenteditable="false" clearable></el-input>
              </div>
            </div>
            <el-input v-else v-model="promotData" :rows="10" type="textarea" placeholder="请输入Promot" />
            <el-button type="primary" @click="checkPrompt('system')"> 检测一下效果 </el-button>
          </el-form-item>
        </el-form>
        <div class="tabs">
          <div class="title">
            Promot展示：<el-button v-if="system_textPrompt != ''" v-copy="system_textPrompt" type="primary"> 复制 </el-button>
          </div>
          <div class="button" v-if="drawerProps.isView">
            <p v-if="drawerProps.row!.prompt_template_id != -1">
              <span v-if="system_textPrompt != ''" v-html="system_textPrompt"></span>
              <span v-else>暂无Promot，请编辑</span>
            </p>
            <p v-else>
              <span v-html="system_textPrompt"></span>
            </p>
          </div>
          <div class="button" v-else>{{ system_textPrompt }}</div>
        </div>
      </div>

      <div class="flex main">
        <el-form
          ref="ruleFormRef"
          label-width="130px"
          label-suffix=" :"
          :rules="rules"
          :disabled="drawerProps.isView"
          :model="drawerProps.row"
          :hide-required-asterisk="drawerProps.isView"
        >
          <el-form-item label="Usersay模板选择" prop="template_name">
            <el-select
              :class="{'template_select':drawerProps.row!.user_template_id == -1}"
              v-model="drawerProps.row!.user_template_id"
              @change="getTemplate(drawerProps.row!.user_template_id, 'usersay')"
              placeholder="请选择"
            >
              <el-option
                v-for="item in usersay_templateList"
                :key="item.value"
                :disabled="item.template_type != 'user_say'"
                :label="item.template_name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            v-if="drawerProps.row!.user_template_id"
            :label="drawerProps.row!.user_template_id == -1 ? 'Promot填写': '变量填写'"
            prop="content"
          >
            <div style="width: 100%" v-if="drawerProps.row!.user_template_id != -1" contenteditable="false">
              <div class="list" v-for="item in usersay_template_check" :key="item.id">
                <el-tag type="success">{{ item.variable_name }} | {{ item.variable_cname }}</el-tag>
                <el-input v-model="item.value" placeholder="请输入" contenteditable="false" clearable></el-input>
              </div>
            </div>
            <el-button @click="checkPrompt('user_say')" type="primary"> 检测一下效果 </el-button>
          </el-form-item>
        </el-form>
        <div class="tabs">
          <div class="title">
            Promot展示：<el-button v-if="usersay_textPrompt != ''" v-copy="usersay_textPrompt" type="primary"> 复制 </el-button>
          </div>
          <div class="button" v-if="drawerProps.isView">
            <p v-if="drawerProps.row!.user_template_id != -1">
              <span v-if="usersay_textPrompt != ''" v-html="usersay_textPrompt"></span>
              <span v-else>暂无Promot，请编辑</span>
            </p>
            <p v-else>
              <span v-html="usersay_textPrompt"></span>
            </p>
          </div>
          <div class="button" v-else>{{ usersay_textPrompt }}</div>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
          <el-button @click="handleClose"> 取消 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="template">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ref, reactive, nextTick } from "vue";
// import { genderType } from "@/utils/serviceDict";
import { ElMessage, FormInstance } from "element-plus";
import { templateType, getTemplateList, getVariableList } from "@/api/prompt";
import { isModelType } from "@/utils/index";
const rules = reactive({
  default_chat_mode: [{ required: true, message: "请选择一个模型" }],
  prompt_template_id: [{ required: true, message: "请选择一个模板" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<templateType>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

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

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});
const promotData = ref("");
//复制内容
const system_textPrompt = ref("");
const usersay_textPrompt = ref("");
const templateList = ref([]);
const system_templateList = ref([]);
const usersay_templateList = ref([]);
const getTempList = (row: Partial<variableType>) => {
  getTemplateList().then(res => {
    getList();
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

const system_template_check = ref([]);
const system_template_content = ref();
const system_template_vars = ref();

const usersay_template_check = ref();
const usersay_template_content = ref();
const usersay_template_vars = ref();
const getTemplate = (template_id, type) => {
  if (type == "system") {
    system_template_check.value = [];
  } else {
    usersay_template_check.value = [];
  }
  let promptData = templateList.value.find(item => item.id == template_id);
  promptData.template_vars.forEach(element => {
    // prompt_vars user_say_vars
    if (promptData.template_type == "system") {
      system_template_vars.value = promptData.template_vars;
      system_template_content.value = promptData.template_content;
      system_template_check.value.push(getKey(element));
    } else if (promptData.template_type == "user_say") {
      usersay_template_vars.value = promptData.template_vars;
      usersay_template_content.value = promptData.template_content;
      usersay_template_check.value.push(getKey(element));
    }
  });
};

const getKey = name => {
  return variableList.value.find(item => item.variable_name === name);
};

const checkPrompt = type => {
  if (type == "system") {
    if (drawerProps.value.row!.prompt_template_id == -1) {
      system_textPrompt.value = promotData;
      return false;
    }
    return getTextPrompt(system_template_check, system_template_content, system_textPrompt, system_template_vars);
  } else {
    if (drawerProps.value.row!.user_template_id == -1) {
      usersay_textPrompt.value = promotData;
      return false;
    }
    return getTextPrompt(usersay_template_check, usersay_template_content, usersay_textPrompt, usersay_template_vars);
  }
};

const getTextPrompt = (template_check, template_content, textPrompt, template_vars) => {
  for (let inx = 0; inx < template_check.value.length; inx++) {
    if (template_check.value[inx].value == "" || template_check.value[inx].value == undefined) {
      textPrompt.value = "";
      ElMessage.error({ message: `请输入全部变量值` });
      return false;
    }
  }
  textPrompt.value = template_content.value;
  template_vars.value.forEach((element, index) => {
    textPrompt.value = textPrompt.value.replace("{" + element + "}", template_check.value[index].value);
  });
  let str2 = textPrompt.value.replace(/{/g, "");
  textPrompt.value = str2.replace(/}/g, "");
  return textPrompt;
};

const stopTemplate = () => {
  drawerProps.value.row!.prompt_template_id = -1;
};
const variableList = ref();
const getList = (row: Partial<variableType>) => {
  getVariableList({ page: 1, pageSize: 1000 }).then(res => {
    if (res.code == 200) {
      variableList.value = res.data.list;
      nextTick(() => {
        if (drawerProps.value.row!.prompt_template_id != "" && drawerProps.value.row!.prompt_template_id != -1) {
          getTemplate(drawerProps.value.row!.prompt_template_id, "system");
          setTimeout(() => {
            assignment(system_template_check, drawerProps.value.row!.prompt_vars, "system");
          }, 300);
        }
        if (drawerProps.value.row!.user_template_id != "" && drawerProps.value.row!.user_template_id != -1) {
          getTemplate(drawerProps.value.row!.user_template_id, "usersay");
          setTimeout(() => {
            assignment(usersay_template_check, drawerProps.value.row!.user_say_vars, "user_say");
          }, 300);
        }
      });
    }
  });
};
const assignment = (template, vars, name) => {
  template.value.forEach(element => {
    element.value = vars[element.variable_name];
  });
  checkPrompt(name);
};
// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  // dataError.value.disabled = false;
  await getTempList();
  if (drawerProps.value.row!.prompt_template_id != -1) {
    promotData.value = "";
  } else {
    promotData.value = drawerProps.value.row!.prompt_template;
    system_textPrompt.value = drawerProps.value.row!.prompt_template;
  }

  // console.log(drawerProps.value.row!.prompt_template_id);
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  if (drawerProps.value.row!.prompt_template_id == -1) {
    stopTemParams();
    return false;
  }
  if (drawerProps.value.isView) {
    handleClose();
    return false;
  }
  let prompt_vars = {};
  if (drawerProps.value.row!.prompt_template_id) {
    for (let inx = 0; inx < system_template_check.value.length; inx++) {
      if (system_template_check.value[inx].value == "" || system_template_check.value[inx].value == undefined) {
        system_textPrompt.value = "";
        ElMessage.error({ message: `请输入全部变量值` });
        return false;
      }
      prompt_vars[system_template_check.value[inx].variable_name] = system_template_check.value[inx].value;
    }
  }

  let usersay_prompt_vars = {};
  if (drawerProps.value.row!.user_template_id) {
    for (let iny = 0; iny < usersay_template_check.value.length; iny++) {
      if (usersay_template_check.value[iny].value == "" || usersay_template_check.value[iny].value == undefined) {
        usersay_textPrompt.value = "";
        ElMessage.error({ message: `请输入全部变量值` });
        return false;
      }
      usersay_prompt_vars[usersay_template_check.value[iny].variable_name] = usersay_template_check.value[iny].value;
    }
  }

  const params = {
    prompt_template: system_template_content.value,
    user_say_template: usersay_template_content.value,
    prompt_vars: prompt_vars,
    user_say_vars: usersay_prompt_vars,
    ai_uid: drawerProps.value.row!.ai_uid,
    prompt_template_id: drawerProps.value.row!.prompt_template_id,
    user_template_id: drawerProps.value.row!.user_template_id,
    llm_type: drawerProps.value.row!.llm_type
  };
  console.log("params", params);
  submitTemplate(params);
};

const stopTemParams = () => {
  if (promotData.value == "") {
    ElMessage.error({ message: `请输入Promot` });
    return false;
  }
  let usersay_prompt_vars = {};
  if (drawerProps.value.row!.user_template_id >= 1) {
    for (let iny = 0; iny < usersay_template_check.value.length; iny++) {
      if (usersay_template_check.value[iny].value == "" || usersay_template_check.value[iny].value == undefined) {
        usersay_textPrompt.value = "";
        ElMessage.error({ message: `请输入全部变量值` });
        return false;
      }
      usersay_prompt_vars[usersay_template_check.value[iny].variable_name] = usersay_template_check.value[iny].value;
    }
  }

  const params = {
    prompt_template: promotData.value,
    prompt_vars: [],
    ai_uid: drawerProps.value.row!.ai_uid,
    user_template_id: drawerProps.value.row!.user_template_id,
    user_say_template: usersay_template_content.value,
    user_say_vars: usersay_prompt_vars,
    prompt_template_id: drawerProps.value.row!.prompt_template_id,
    llm_type: drawerProps.value.row!.llm_type
  };
  submitTemplate(params);
};
const submitTemplate = async params => {
  try {
    await drawerProps.value.api!(params);
    ElMessage.success({ message: `${drawerProps.value.title}模板成功！` });
    drawerProps.value.getTableList!();
    drawerVisible.value = false;
  } catch (error) {
    console.log(error);
  }
};

const handleClose = (params: DrawerProps) => {
  system_template_check.value = [];
  system_template_content.value = "";
  system_template_vars.value = "";

  usersay_template_check.value = "";
  usersay_template_content.value = "";
  usersay_template_vars.value = "";

  system_textPrompt.value = "";
  usersay_textPrompt.value = "";
  templateList.value = [];
  system_templateList.value = [];
  usersay_templateList.value = [];

  console.log("123123", 131231231);
  drawerVisible.value = false;
};

defineExpose({
  acceptParams
});
</script>
<style lang="scss">
.template {
  .el-form-item__label {
    width: 90px;
    margin-right: 10px;
  }
  .el-form {
    width: 60%;
  }
  .tips {
    padding: 0 25px;
    margin-bottom: 20px;
    color: #938d8d;
  }
  .main {
    justify-content: flex-start;
    width: 100%;
  }
  .tabs {
    width: 38%;
    margin-left: 20px;
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .button {
      max-height: 350px;
      overflow: auto;
      word-wrap: break-word;
      white-space: normal;
    }
  }
  .el-button {
    margin: 3px;

    // margin-bottom: 5px;
  }
  .prompt {
    width: 100%;
    height: 300px;
    padding: 5px 10px;
    background-color: var(--el-input-bg-color, var(--el-fill-color-blank));
    background-image: none;
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
  }
  .list {
    width: 80%;
    margin-bottom: 10px;
  }
  .error {
    font-size: 14px;
    color: red;
  }
  .template_select {
    .el-input__inner {
      opacity: 0;
    }
  }
}
</style>
