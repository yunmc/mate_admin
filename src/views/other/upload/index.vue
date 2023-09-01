<template>
  <div class="main-box">
    <div class="content">
      <!-- <UploadVoice v-model:image-url="voiceList" height="140px" width="540px" :file-size="10">
        <template #empty>
          <el-icon><Picture /></el-icon>
          <span>请上传音频文件</span>
        </template>
        <template #tip> 音频大小不能超过 10M </template>
      </UploadVoice> -->
    </div>
  </div>
</template>

<script setup lang="tsx" name="Upload">
// import UploadVoice from "@/components/Upload/voice.vue";
const voiceList = [];
</script>

<style scoped lang="scss">
:deep {
  .el-checkbox__label {
    display: none;
  }
}
.main {
  display: block;
  flex: 1;
  flex-basis: auto;
  overflow: auto;
}
.main-box {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.search {
  box-sizing: border-box;
  padding: 10px 18px;
  margin-bottom: 10px;
  overflow-x: hidden;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  box-shadow: 0 0 12px rgb(0 0 0 / 5%);
  .label {
    align-items: center;
    justify-content: flex-start;
    font-size: 14px;
    color: var(--el-text-color-regular);
    p {
      padding: 0 12px 0 0;
    }
    .el-input {
      width: 280px;
      margin-right: 10px;
    }
  }
}
.content {
  box-sizing: border-box;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow-x: hidden;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  box-shadow: 0 0 12px rgb(0 0 0 / 5%);
  .top {
    margin-bottom: 10px;
  }
  .cont_table {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    height: -moz-fit-content;
    height: 100%;

    // padding: 10px;
    overflow: scroll;
    font-size: 14px;
    color: var(--el-table-text-color);
    background-color: var(--el-table-border-color);
    border: 1px solid var(--el-border-color-light);
    border-radius: 6px;
  }
  .list {
    float: left;
    width: 180px;
    padding: 0 10px;
    margin: 5px 10px;
    border: 1px solid var(--el-border-color-light);
    border-radius: 6px;
    box-shadow: 0 0 12px rgb(0 0 0 / 5%);
    .img {
      width: 180px;
      height: 180px;
      img {
        width: 180px;
        height: 180px;
      }
    }
    .footer {
      height: 40px;
      font-size: 14px;
      .more {
        cursor: pointer;
        transform: rotate(90deg);
      }
    }
  }
  .demo-pagination-block {
    margin-top: 20px;
  }
}
</style>
