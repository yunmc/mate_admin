<template>
  <div class="system" v-if="drawerProps.isView">
    <el-form-item prop="content">
      <div style="width: 100%" contenteditable="false">
        <div class="list" v-for="item in data.system_template_check" :key="item.id">
          <el-tag type="success">{{ item.variable_name }} | {{ item.variable_cname }}</el-tag>
          <el-input v-model="item.value" placeholder="请输入" contenteditable="false" clearable></el-input>
        </div>
      </div>
      {{ data.system_template_content }}
      <el-button @click="checkPrompt()" type="primary"> 检测一下效果 </el-button>
    </el-form-item>
  </div>
</template>

<script setup lang="ts" name="system">
import { ref, reactive, nextTick } from "vue";

interface DrawerProps {
  isView: boolean;
  row: object;
  templateList: Array;
  variableList: Array;
}

const drawerProps = ref<DrawerProps>({
  isView: false,
  row: {},
  templateList: [],
  variableList: []
});

const data = ref({
  system_template_check: [],
  system_template_content: "",
  system_template_vars: "",
  system_textPrompt: ""
});
const system_textPrompt = ref("");
// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  data.value.system_template_check = [];
  data.value.system_template_content = "";
  data.value.system_template_vars = "";
  templateInit();
};
const templateInit = () => {
  let promptData = drawerProps.value.templateList.find(item => item.id == drawerProps.value.row!.prompt_template_id);
  console.log("promptData", promptData);

  promptData.template_vars.forEach(element => {
    data.value.system_template_vars = promptData.template_vars;
    data.value.system_template_content = promptData.template_content;
    data.value.system_template_check.push(getKey(element));
  });
  console.log("data.value", data.value);
};
const getKey = name => {
  return drawerProps.value.variableList.find(item => item.variable_name === name);
};

const checkPrompt = () => {
  console.log("template_content");
  // data.value.system_template_vars.forEach((element, index) => {
  //   textPrompt.value = textPrompt.value.replace("{" + element + "}", template_check[index]);
  // });
};

const getTextPrompt = (template_check, template_content, textPrompt, template_vars) => {
  for (let inx = 0; inx < template_check.length; inx++) {
    if (template_check[inx] == "" || template_check[inx] == undefined) {
      textPrompt.value = "";
      ElMessage.error({ message: `请输入全部变量值` });
      return false;
    }
  }
  textPrompt.value = template_content;
  console.log("template_vars", template_vars);
  console.log(" textPrompt.value", textPrompt.value);

  let str2 = textPrompt.value.replace(/{/g, "");
  textPrompt.value = str2.replace(/}/g, "");
  return textPrompt;
};

defineExpose({
  acceptParams
});
</script>
<style lang="scss"></style>
