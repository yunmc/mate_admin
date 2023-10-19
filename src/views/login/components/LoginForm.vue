<template>
  <div id="login_container" class="code"></div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
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
import { getQueryString } from "@/utils/index";
// import md5 from "js-md5";

const router = useRouter();
const route = useRoute();

const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();

type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();

const loading = ref(false);
/* tslint:disable */
let url = encodeURIComponent("https://test-admin-matelink.flyai.com/#/login");
console.log(url);
const fsLogin = () => {
  const goto =
    "https://passport.feishu.cn/suite/passport/oauth/authorize?client_id=" +
    "cli_a16c9d1a4479d00e" +
    "&redirect_uri=" +
    url +
    "&response_type=code&state=STATE";
  try {
    // @ts-expect-error 222
    let QRLoginObj = QRLogin({
      id: "login_container",
      goto: goto,
      width: "300",
      height: "300"
      // style: "width:200px;height:200px" //可选的，二维码html标签的style属性
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
  } catch (error) {
    console.log("error", error);
  }
};
// nextTick(() => {
//   if(){}
//   fsLogin()
// });
// login
const login = async (code: string) => {
  // 1.执行登录接口
  let data = await loginApi({ code: code });
  if (data.code == "200") {
    userStore.setToken(data.data.access_token);
    userStore.setUserInfo(data.data.userInfo);
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
  } else {
    fsLogin();
  }
};

onMounted(() => {
  if (route.query.code) {
    login(route.query.code as string);
  } else {
    fsLogin();
  }
});
</script>

<style scoped lang="scss">
@import "../index.scss";
.code {
  // width: 200px;
  // height: 200px;
  margin: 0 auto;
  text-align: center;
}
.login-logo {
  margin-bottom: 0 !important;
}
</style>
