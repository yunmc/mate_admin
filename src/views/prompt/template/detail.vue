<template>
  <div class="template">
    <el-dialog
      v-model="drawerVisible"
      :title="`${drawerProps.title}`"
      width="65%"
      @before-close="
        handleClose();
        resetForm(ruleFormRef);
      "
    >
      <div class="flex main">
        <el-form
          ref="ruleFormRef"
          label-width="120px"
          label-suffix=" :"
          :rules="rules"
          :model="drawerProps.row"
          :hide-required-asterisk="drawerProps.isView"
        >
          <el-form-item label="模板名称" prop="template_name">
            <el-input v-model="drawerProps.row!.template_name" maxlength="30" placeholder="请编辑一个名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="模板备注" prop="remark">
            <el-input v-model="drawerProps.row!.remark" :rows="3" maxlength="100" type="textarea" placeholder="请输入备注" />
          </el-form-item>
          <el-form-item label="Prompt编辑" prop="content">
            <div class="bgholder" v-if="isPlaceholder">请输入内容</div>
            <div
              contenteditable
              id="edit"
              ref="edit"
              v-html="content"
              @click="editClick"
              class="prompt"
              placeholder="请输入"
              @input="getData"
            ></div>
            <div style="margin-top: 10px; line-height: 18px">
              修改时注意：若该模版已给某个AI配置，修改时能增加新变量，不要删减变量，不要删减变量。
            </div>
          </el-form-item>
        </el-form>
        <div class="tabs">
          <div class="title">变量库：</div>
          <div class="button">
            <el-button v-for="item in variableList" @click="promptPush(item)" :key="item.id">
              {{ item.variable_name }}&nbsp;| {{ item.variable_cname }}
            </el-button>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
          <el-button
            @click="
              resetForm(ruleFormRef);
              drawerVisible = false;
            "
            >取消</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="template">
// @ts-nocheck
import { ref, reactive, nextTick } from "vue";
// import { genderType } from "@/utils/serviceDict";
import { ElMessage, FormInstance } from "element-plus";
import { templateType, getVariableList } from "@/api/prompt";
import { isModelType } from "@/utils/index";
const rules = reactive({
  template_name: [{ required: true, message: "请编辑一个名称" }],
  template_content: [{ required: true, message: "请填写Prompt" }]
});

/* tslint:disable */

interface DrawerProps {
  title: string;
  isView: boolean;
  row: any;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const options = [
  {
    value: "STRING",
    label: "STRING"
  },
  {
    value: "NUMBER",
    label: "NUMBER"
  }
];

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});
const variableList = ref();

const promptInit = () => {
  let str_content = "";
  console.log(" drawerProps.value.row!.template_vars", drawerProps.value.row!.template_vars);
  drawerProps.value.row!.template_vars.forEach((element: any) => {
    let obj = findInd(element);
    let str = "";
    if (obj == undefined) {
      str = "<s style='color:red'>变量已删除</s>";
    } else {
      str = obj.variable_name + "&nbsp;|&nbsp;" + obj.variable_cname;
    }
    // console.log(index, drawerProps.value.row!.template_content, element, str);
    str_content = drawerProps.value.row!.template_content.replace("{" + element + "}", str);
    drawerProps.value.row!.template_content = str_content;
  });
  let str2 = drawerProps.value.row!.template_content.replace(
    /{/g,
    "<span class='el-button el-button--default' contenteditable='false'>"
  );
  content.value = str2.replace(/}/g, "</span>\u200b");
  console.log("content.value", content.value);
};

const findInd = (name: any) => {
  return variableList.value.find((item: any) => item.variable_name === name);
};

let content = ref();
// 定义鼠标光标值
let lastEditRange = null;
// 定义DIV真实dom
let edit = ref();
const isPlaceholder = ref(false);
const getData = () => {
  if (edit.value.innerHTML == "") {
    isPlaceholder.value = true;
  } else {
    isPlaceholder.value = false;
  }
};
document.addEventListener("paste", e => {
  if (!drawerVisible.value) {
    return false;
  }
  // 阻止默认的复制事件
  e.preventDefault();
  let txt = "";
  let range = null;
  // 获取复制的文本
  txt = e.clipboardData.getData("text/plain");
  // 获取页面文本选区
  range = window.getSelection().getRangeAt(0);
  // 删除默认选中文本
  range.deleteContents();
  // 创建一个文本节点，用于替换选区文本
  let pasteTxt = document.createTextNode(txt);
  // 插入文本节点
  range.insertNode(pasteTxt);
  // 将焦点移动到复制文本结尾
  range.collapse(false);
  getData();
});

const promptPush = (row: any) => {
  let selection = getSelection();
  if (selection?.focusNode.id != "edit" && selection?.focusNode.parentElement.id != "edit") {
    return false;
  }
  // 获取光标对象
  let range = selection?.getRangeAt(0);
  // 获取光标对象的范围界定对象，一般就是textNode对象
  let textNode = range.startContainer;
  console.log("textNode", textNode);
  // 获取光标位置
  let rangeStartOffset = range.startOffset;

  let el = document.createElement("div");
  let span = document.createElement("span");
  span.className = "el-button el-button--default";
  span.innerHTML = row.variable_name + "&nbsp;|&nbsp;" + row.variable_cname;
  span.setAttribute("contenteditable", "false");
  // span.setAttribute("id", row.variable_name);
  el.appendChild(span);
  el.appendChild(document.createTextNode("\u200b")); // 非法字符错误：零度空间（空格）
  let frag = document.createDocumentFragment(),
    node,
    lastNode;
  while ((node = el.firstChild)) {
    lastNode = frag.appendChild(node);
  }
  // 在光标位置处插入新的表情内容
  range.insertNode(frag);
  // 添加了新内容，将光标移动到新的位置
  if (lastNode) {
    range = range.cloneRange();
    range.setStartAfter(lastNode);
    range.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
  // 记录最后光标对象
  lastEditRange = selection?.getRangeAt(0);
};
const editClick = () => {
  // 获取选定对象
  let selection = getSelection();
  // 设置最后光标对象
  lastEditRange = selection?.getRangeAt(0);
};
// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  console.log("params", params);
  drawerProps.value = params;
  drawerVisible.value = true;
  getList();
};

const handleClose = (params: DrawerProps) => {
  drawerProps.value.row! = {};
  document.getElementById("edit").innerHTML = "";
  drawerVisible.value = false;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  let arr = edit?.value.innerHTML.split("\u200b");
  // console.log("123123123213", edit?.value.innerHTML.split("</span>"));
  let str = "";
  let vars = [];
  let isStop = false;
  arr.forEach((element, index) => {
    let a = element.split('<span class="el-button el-button--default" contenteditable="false">');
    if (a.length > 1) {
      if (a[0] == '<s style="color:red">变量已删除</s></span>' || a[1] == '<s style="color:red">变量已删除</s></span>') {
        ElMessage.error({ message: `当前有变量被删除，请重新编辑` });
        isStop = true;
        return false;
      }
      let b = a[1].split("&nbsp")[0];
      str += a[0] + "{{" + a[1].split("&nbsp")[0] + "}}";
      vars.push(a[1].split("&nbsp")[0]);
    } else {
      if (a[0] == '<s style="color:red">变量已删除</s></span>') {
        ElMessage.error({ message: `当前有变量被删除，请重新编辑` });
        isStop = true;
        return false;
      } else {
        str += a[0];
      }
    }
    if (index == arr.length - 1 && !isStop) {
      submitTemplate(str, vars);
    }
  });
};

const submitTemplate = (str, vars) => {
  if (str != "") {
    drawerProps.value.row!.template_content = str;
  }
  if (vars.length >= 1) {
    drawerProps.value.row!.template_vars = vars;
  }
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}模板成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

const getList = (row: Partial<templateType>) => {
  getVariableList({ page: 1, pageSize: 100 }).then((res: any) => {
    variableList.value = res.data.list;
    // document.getElementById("edit").innerHTML = "";
    nextTick(() => {
      if (drawerProps.value.isView) {
        isPlaceholder.value = false;
        promptInit();
      } else {
        isPlaceholder.value = true;
        document.getElementById("edit").innerHTML = "";
        // resetForm(ruleFormRef);
      }
    });
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  // document.getElementById("edit").innerHTML = "";
  if (!formEl) return;
  formEl.resetFields();
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
    overflow: auto;
    background-color: var(--el-input-bg-color, var(--el-fill-color-blank));
    background-image: none;
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
  }
  .bgholder {
    position: absolute;
    top: 5px;
    left: 10px;
    color: #a8abb2;
  }
}
</style>
