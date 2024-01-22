<template>
  <div class="system" v-if="drawerProps.isView">
    <el-form-item prop="content">
      <div style="width: 100%" contenteditable="false">
        <div class="list" v-for="item in data.system_template_check" :key="item.id">
          <el-tag type="success">{{ item.variable_name }} | {{ item.variable_cname }}</el-tag>
          <el-input
            v-if="item.variable_name != 'CAI_ID' && item.variable_name != 'PROMPT_ID'"
            v-model="item.value"
            placeholder="请输入"
            contenteditable="false"
            clearable
          ></el-input>
          <el-input
            v-model="item.value"
            v-else
            :rows="6"
            type="textarea"
            placeholder="请输入"
            contenteditable="false"
            clearable
          ></el-input>
        </div>
      </div>

      <el-button @click="checkPrompt()" v-if="data.system_template_check.length >= 1" class="test" type="primary">
        检测一下效果
      </el-button>
    </el-form-item>

    <el-dialog v-model="dialogVisible" title="Promot展示" width="50%" draggable>
      <p>{{ data.system_textPrompt }}</p>
      <el-link class="copy" type="primary" v-copy="data.system_textPrompt">复制</el-link>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false"> 关闭 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="system">
import { ref, reactive, nextTick } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { usePromptStore } from "@/stores/modules/prompt";
import { deepClone } from "@/utils/index";
const usePrompt = usePromptStore();
interface DrawerProps {
  isView: boolean;
  row: any;
  templateList: Array<any>;
  variableList: Array<any>;
  isRefresh: boolean;
}
const dialogVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  row: {},
  templateList: [],
  variableList: [],
  isRefresh: true
});
interface DrawerData {
  system_template_check: any;
  system_template_content: any;
  system_template_vars: any;
  system_textPrompt: any;
}
const data = ref<DrawerData>({
  system_template_check: [],
  system_template_content: "",
  system_template_vars: "",
  system_textPrompt: ""
});
// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  console.log("params", params);
  console.log("data", data);
  drawerProps.value = params;
  data.value.system_template_check = [];
  data.value.system_template_content = "";
  data.value.system_template_vars = "";
  data.value.system_textPrompt = "";
  templateInit();
};
const templateInit = () => {
  if (drawerProps.value.row!.prompt_template_id == "") {
    return false;
  }
  let promptData = drawerProps.value.templateList.find((item: any) => item.id == drawerProps.value.row?.prompt_template_id);
  // console.log("promptData", promptData);
  promptData.template_vars.forEach((element: any) => {
    data.value.system_template_vars = promptData.template_vars;
    data.value.system_template_content = promptData.template_content;
    data.value.system_template_check.push(getKey(element));
  });
};
const getKey = (name: any) => {
  // return drawerProps.value.variableList.find(item => item.variable_name === name);
  const data2 = drawerProps.value.variableList.find((item: any) => item.variable_name === name);
  data2.value = drawerProps.value.row?.prompt_vars[data2.variable_name];
  return deepClone(data2);
};

const checkPrompt = () => {
  for (let inx = 0; inx < data.value.system_template_check.length; inx++) {
    if (data.value.system_template_check[inx].value == "" || data.value.system_template_check[inx].value == undefined) {
      data.value.system_textPrompt = "";
      ElMessage.error({ message: `请输入全部变量值` });
      return false;
    }
  }
  data.value.system_textPrompt = data.value.system_template_content;
  data.value.system_template_vars.forEach((element: any, index: any) => {
    data.value.system_textPrompt = data.value.system_textPrompt.replace(
      "{" + element + "}",
      data.value.system_template_check[index].value
    );
  });
  let str2 = data.value.system_textPrompt.replace(/{/g, "");
  data.value.system_textPrompt = str2.replace(/}/g, "");
  dialogVisible.value = true;
};

const getResultPrompt = () => {
  console.log("drawerProps.value.row!", drawerProps.value.row!);
  if (drawerProps.value.row!.prompt_template_id == "") {
    ElMessage.error({ message: `请选择System模板` });
    return false;
  }
  drawerProps.value.row!.prompt_template = data.value.system_template_content;

  drawerProps.value.row!.prompt_vars = {};
  data.value.system_template_check.forEach((element: any, index: any) => {
    console.log("element.value", element.value, index);
    if ((element.variable_name == "" || element.value == undefined) && usePrompt.isMessage) {
      usePrompt.isMessage = false;
      ElMessage.error({ message: `请输入全部变量值` });
      usePrompt.isSystem = false;
      return false;
    }
    drawerProps.value.row!.prompt_vars[element.variable_name] = element.value;
    if (data.value.system_template_check.length - 1 == index && usePrompt.isMessage) {
      usePrompt.isSystem = true;
    }
  });
};
defineExpose({
  acceptParams,
  getResultPrompt
});
</script>
<style lang="scss">
.test {
  margin-top: 20px;
}
.copy {
  margin-top: 20px;
  font-size: 16px;
}
</style>
