<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large"> <div id="code" class="code"></div></el-form>
  <div class="login-btn">
    <el-button :icon="CircleClose" round size="large" @click="resetForm(loginFormRef)"> 重置 </el-button>
    <el-button :icon="UserFilled" round size="large" type="primary" :loading="loading" @click="login(loginFormRef)">
      登录
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { HOME_URL } from "@/config";
import { getTimeState } from "@/utils";
import { Login } from "@/api/interface";
import { ElNotification } from "element-plus";
import { loginApi } from "@/api/modules/login";
import { useUserStore } from "@/stores/modules/user";
import { useTabsStore } from "@/stores/modules/tabs";
import { useKeepAliveStore } from "@/stores/modules/keepAlive";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import type { ElForm } from "element-plus";
// import md5 from "js-md5";

const router = useRouter();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();

type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }]
});

const loading = ref(false);
const loginForm = reactive<Login.ReqLoginForm>({
  username: "",
  password: ""
});
/* tslint:disable */
const fsLogin = () => {
  const goto =
    "https://passport.feishu.cn/suite/passport/oauth/authorize?client_id=" +
    "cli_a16c9d1a4479d00e" +
    "&redirect_uri=" +
    "https://test-api.matelink.com/admin/user/login_redirect" +
    "&response_type=code&state=STATE";
  // window.location = goto;
  try {
    // @ts-expect-error 222
    let QRLoginObj = QRLogin({
      id: "login_container",
      goto: goto,
      width: "500",
      height: "500",
      style: "width:200px;height:200px" //可选的，二维码html标签的style属性
    });
    console.log("QRLoginObj", QRLoginObj);
    let handleMessage = function (event: any) {
      let origin = event.origin;
      // 使用 matchOrigin 方法来判断 message 来自页面的url是否合法
      if (QRLoginObj.matchOrigin(origin)) {
        let loginTmpCode = event.data;
        // 在授权页面地址上拼接上参数 tmp_code，并跳转
        window.location.href = `${goto}&tmp_code=${loginTmpCode}`;
      }
    };
    if (typeof window.addEventListener != "undefined") {
      window.addEventListener("message", handleMessage, false);
    }
  } catch (error) {}
};
fsLogin();
// login
const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    try {
      // 1.执行登录接口
      const { data } = await loginApi({ ...loginForm, password: loginForm.password });
      userStore.setToken(data.access_token);

      // 2.添加动态路由
      await initDynamicRouter();

      // 3.清空 tabs、keepAlive 数据
      tabsStore.closeMultipleTab();
      keepAliveStore.setKeepAliveName();

      // 4.跳转到首页
      router.push(HOME_URL);
      ElNotification({
        title: getTimeState(),
        message: "欢迎登录",
        type: "success",
        duration: 3000
      });
    } finally {
      loading.value = false;
    }
  });
};

// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

onMounted(() => {
  // 监听 enter 事件（调用登录）
  document.onkeydown = (e: KeyboardEvent) => {
    e = (window.event as KeyboardEvent) || e;
    if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
      if (loading.value) return;
      login(loginFormRef.value);
    }
  };
});
</script>

<style scoped lang="scss">
@import "../index.scss";
.code {
  width: 200px;
  height: 200px;
  margin: 0 auto;
}
.login-logo {
  margin-bottom: 0 !important;
}
</style>
