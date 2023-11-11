<template>
  <div class="template">
    <el-dialog v-model="drawerVisible" :title="`${drawerProps.title}`" width="65%" @before-close="handleClose">
      <div class="flex main">
        <el-form
          ref="ruleFormRef"
          label-width="120px"
          label-suffix=" :"
          :rules="rules"
          :disabled="drawerProps.isView"
          :model="drawerProps.row"
          :hide-required-asterisk="drawerProps.isView"
        >
          <el-form-item label="模型选择" prop="template_name">
            <el-select v-model="drawerProps.row!.default_chat_mode" placeholder="请选择">
              <el-option v-for="item in modeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模板选择" prop="template_name">
            <el-select
              :class="{'template_select':drawerProps.row!.prompt_template_id == -1}"
              v-model="drawerProps.row!.prompt_template_id"
              @change="getTemplate()"
              placeholder="请选择"
            >
              <el-option v-for="item in templateList" :key="item.value" :label="item.template_name" :value="item.id"> </el-option>
            </el-select>
            <el-button type="" link @click="stopTemplate">不用模版--自定义</el-button>
          </el-form-item>
          <el-form-item label="变量填写" prop="content">
            <div v-if="drawerProps.row!.prompt_template_id != -1">
              <div class="list" v-for="item in template_check" :key="item.id">
                <el-tag type="success">{{ item.variable_name }} | {{ item.variable_cname }}</el-tag>
                <el-input v-model="item.value" placeholder="请输入" :disabled="dataError.disabled" clearable></el-input>
              </div>
            </div>
            <el-input v-else v-model="promotData" :rows="10" type="textarea" placeholder="请输入Promot" />
            <el-button
              v-if="template_check != '' && !dataError.disabled && drawerProps.row!.prompt_template_id != -1"
              @click="checkPrompt()"
              type="primary"
            >
              检测一下效果
            </el-button>
            <div class="error" v-if="dataError.disabled && drawerProps.row!.prompt_template_id != ''">
              {{ dataError.error }}
            </div>
          </el-form-item>
        </el-form>
        <div class="tabs">
          <div class="title">
            Promot展示：<el-button v-if="textPrompt != ''" v-copy="textPrompt" type="primary"> 复制 </el-button>
          </div>
          <div class="button" v-if="drawerProps.isView">
            <p v-if="drawerProps.row!.prompt_template_id != -1">{{ textPrompt ? textPrompt : "暂无Promot，请编辑" }}</p>
            <p v-else>{{ promotData }}</p>
          </div>
          <div class="button" v-else>{{ textPrompt }}</div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" v-if="!dataError.disabled" @click="handleSubmit"> 确定 </el-button>
          <el-button
            @click="
              resetForm(ruleFormRef);
              drawerVisible = false;
            "
          >
            取消
          </el-button>
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
  template_name: [{ required: true, message: "请编辑一个名称" }],
  template_content: [{ required: true, message: "请填写Prompt" }]
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
    value: 1,
    label: "ChatGPT3.5 16K "
  }
];

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});
const promotData = ref("");
const templateList = ref();
const getTempList = (row: Partial<variableType>) => {
  getTemplateList().then(res => {
    getList();
    if (res.code == 200) {
      templateList.value = res.data.list;
    }
  });
};

const variableList = ref();
const getList = (row: Partial<variableType>) => {
  getVariableList().then(res => {
    template_check.value = [];
    template_vars.value = [];
    template_content.value = "";
    textPrompt.value = "";
    if (res.code == 200) {
      variableList.value = res.data.list;
      nextTick(() => {
        if (drawerProps.value.row!.prompt_template_id != "" && drawerProps.value.row!.prompt_template_id != -1) {
          getTemplate();
          setTimeout(() => {
            assignment();
          }, 300);
        }
      });
    }
  });
};

// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  await getTempList();
  if (drawerProps.value.row!.prompt_template_id != -1) {
    promotData.value = "";
  } else {
    promotData.value = drawerProps.value.row!.prompt_template;
  }

  // console.log(drawerProps.value.row!.prompt_template_id);
};

const dataError = ref({
  disabled: false,
  error: "模板变量有变动，请重新编辑模板"
});

const handleClose = (params: DrawerProps) => {
  drawerVisible.value = false;
  dataError.value.disabled = false;
};
const template_check = ref([]);
const template_vars = ref([]);
const template_content = ref("");
const template_id = ref("");

const textPrompt = ref("");
const getTemplate = () => {
  let prompt_template_index = templateList.value.findIndex(item => item.id == drawerProps.value.row!.prompt_template_id);
  if (prompt_template_index == -1) {
    return false;
  }
  dataError.value.disabled = false;
  template_check.value = [];
  textPrompt.value = "";
  template_vars.value = templateList.value[prompt_template_index].template_vars;
  template_content.value = templateList.value[prompt_template_index].template_content;
  template_id.value = templateList.value[prompt_template_index].id;
  template_vars.value.forEach(element => {
    let obj = findInd(element);
    if (obj == undefined) {
      dataError.value.disabled = true;
      return false;
    } else {
      obj.value = "";
      template_check.value.push(obj);
    }
  });
};

const findInd = name => {
  console.log(name);
  return variableList.value.find(item => item.variable_name === name);
};

const assignment = name => {
  template_check.value.forEach(element => {
    element.value = drawerProps.value.row!.prompt_vars[element.variable_name];
  });
  checkPrompt();
};

const stopTemplate = () => {
  drawerProps.value.row!.prompt_template_id = -1;
  dataError.value.disabled = false;
};
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
const checkPrompt = () => {
  console.log("template_check.value", template_check.value);
  for (let inx = 0; inx < template_check.value.length; inx++) {
    if (template_check.value[inx].value == "" || template_check.value[inx].value == undefined) {
      textPrompt.value = "";
      ElMessage.error({ message: `请输入全部变量值` });
      return false;
    }
  }
  let str_content = "";
  textPrompt.value = template_content.value;
  template_vars.value.forEach((element, index) => {
    textPrompt.value = textPrompt.value.replace("{" + element + "}", template_check.value[index].value);
  });
  let str2 = textPrompt.value.replace(/{/g, "");
  textPrompt.value = str2.replace(/}/g, "");
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
  for (let inx = 0; inx < template_check.value.length; inx++) {
    if (template_check.value[inx].value == "") {
      textPrompt.value = "";
      ElMessage.error({ message: `请输入全部变量值` });
      return false;
    }
    prompt_vars[template_check.value[inx].variable_name] = template_check.value[inx].value;
  }
  const params = {
    prompt_template: template_content.value,
    prompt_vars: prompt_vars,
    ai_uid: drawerProps.value.row!.ai_uid,
    prompt_template_id: template_id.value
  };
  submitTemplate(params);
};

const stopTemParams = () => {
  if (promotData.value == "") {
    ElMessage.error({ message: `请输入Promot` });
    return false;
  }
  const params = {
    prompt_template: promotData.value,
    prompt_vars: [],
    ai_uid: drawerProps.value.row!.ai_uid,
    prompt_template_id: drawerProps.value.row!.prompt_template_id
  };
  submitTemplate(params);
};
const submitTemplate = params => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(params);
      ElMessage.success({ message: `${drawerProps.value.title}模板成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
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
