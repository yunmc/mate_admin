<template>
  <div class="upload-box">
    <el-upload
      v-model:file-list="fileList"
      ref="upload"
      :id="uuid"
      action="#"
      :limit="1"
      :class="['upload', self_disabled ? 'disabled' : '']"
      :disabled="self_disabled"
      :http-request="handleHttpUpload"
      :before-upload="beforeUpload"
      :on-success="uploadSuccess"
      :on-exceed="handleExceed"
      :on-error="uploadError"
      :on-change="uploadChange"
      :before-remove="removeList"
      :accept="fileType.join(',')"
    >
      <el-button type="primary" :disabled="self_disabled">点击上传</el-button>
    </el-upload>
    <div class="el-upload__tip">
      <slot name="tip"></slot>
    </div>
  </div>
</template>

<script setup lang="ts" name="UploadImg">
import { ref, computed, inject, watch } from "vue";
import { generateUUID } from "@/utils";
import { uploadImg } from "@/api/modules/upload";
import { ElNotification, formContextKey, formItemContextKey, genFileId } from "element-plus";
import type { UploadProps, UploadRequestOptions, UploadInstance, UploadRawFile, UploadUserFile, UploadFile } from "element-plus";

type PdfType = "application/pdf";
interface UploadFileProps {
  fileUrl: string; // 图片地址 ==> 必传
  api?: (params: any) => Promise<any>; // 上传图片的 api 方法，一般项目上传都是同一个 api 方法，在组件里直接引入即可 ==> 非必传
  disabled?: boolean; // 是否禁用上传组件 ==> 非必传（默认为 false）
  fileSize?: number; // 图片大小限制 ==> 非必传（默认为 5M）
  fileType?: PdfType[]; // 图片类型限制 ==> 非必传（默认为 ["image/jpeg", "image/png", "image/gif"]）
}

// 接受父组件参数
const props = withDefaults(defineProps<UploadFileProps>(), {
  fileUrl: "",
  disabled: false,
  fileSize: 50,
  fileType: () => ["application/pdf"]
});
const fileList = ref<UploadUserFile[]>([]);
watch(
  () => props.fileUrl,
  value => {
    if (props.fileUrl != "") {
      console.log("props", props);
      fileList.value = [];
      fileList.value.push({
        name: props.fileUrl.substr(-30),
        url: props.fileUrl
      });
    }
  }
);

/**
 * @description 图片上传成功
 * */
const uploadChange = () => {
  submitUpload();
};
const submitUpload = () => {
  upload.value!.submit();
};

const removeList = (fileList: UploadUserFile) => {
  emit("update:fileUrl", "");
  return true;
};
// 生成组件唯一id
const uuid = ref("id-" + generateUUID());

// 查看图片
const imgViewVisible = ref(false);
// 获取 el-form 组件上下文
const formContext = inject(formContextKey, void 0);
// 获取 el-form-item 组件上下文
const formItemContext = inject(formItemContextKey, void 0);
// 判断是否禁用上传和删除
const self_disabled = computed(() => {
  console.log(props.disabled || formContext?.disabled);
  return props.disabled || formContext?.disabled;
});

/**
 * @description 图片上传
 * @param options upload 所有配置项
 * */
interface UploadEmits {
  (e: "update:fileUrl", value: string): void;
}
const emit = defineEmits<UploadEmits>();
const handleHttpUpload = async (options: UploadRequestOptions) => {
  console.log("options", options);
  let formData = new FormData();
  formData.append("file", options.file);
  formData.append("file_type", "image");
  formData.append("file_source", "resource");
  formData.append("ext", "pdf");
  try {
    const api = props.api ?? uploadImg;
    const { data, code } = await api(formData);
    if (code !== 200) return;
    emit("update:fileUrl", data[0]);
    // 调用 el-form 内部的校验方法（可自动校验）
    formItemContext?.prop && formContext?.validateField([formItemContext.prop as string]);
  } catch (error) {
    options.onError(error as any);
  }
};
/**
 * @description 文件上传之前判断
 * @param rawFile 选择的文件
 * */
const beforeUpload: UploadProps["beforeUpload"] = rawFile => {
  const imgSize = rawFile.size / 1024 / 1024 < props.fileSize;
  const imgType = props.fileType.includes(rawFile.type as PdfType);
  if (!imgType)
    ElNotification({
      title: "温馨提示",
      message: "上传文件不符合所需的格式！",
      type: "warning"
    });
  if (!imgSize)
    setTimeout(() => {
      ElNotification({
        title: "温馨提示",
        message: `上传文件大小不能超过 ${props.fileSize}M！`,
        type: "warning"
      });
    }, 0);
  return imgType && imgSize;
};

/**
 * @description 图片上传成功
 * */
const uploadSuccess = () => {
  ElNotification({
    title: "温馨提示",
    message: "文件上传成功！",
    type: "success"
  });
};

const upload = ref<UploadInstance>();
const handleExceed: UploadProps["onExceed"] = files => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};

/**
 * @description 图片上传错误
 * */
const uploadError = () => {
  ElNotification({
    title: "温馨提示",
    message: "文件上传失败，请您重新上传！",
    type: "error"
  });
};
</script>

<style scoped lang="scss">
:deep(.disabled) {
  .el-upload--picture-card,
  .el-upload-dragger {
    cursor: not-allowed;
    background: var(--el-disabled-bg-color) !important;
    border: 1px dashed var(--el-border-color-darker);
    &:hover {
      border-color: var(--el-border-color-darker) !important;
    }
  }
}
.upload-box {
  width: fit-content;
  height: fit-content;
  border: none;
}
</style>
