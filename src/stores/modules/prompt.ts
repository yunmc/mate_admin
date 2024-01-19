import { defineStore } from "pinia";
import { PromptState } from "@/stores/interface";
import piniaPersistConfig from "@/config/piniaPersist";

export const usePromptStore = defineStore({
  id: "prompt",
  state: (): PromptState => ({
    info: {},
    isSystem: false,
    isUsersay: false,
    isMessage: false
  }),
  getters: {},
  actions: {
    // Set setUserInfo
    setPromptInfo(userInfo: PromptState) {
      this.info = userInfo;
    }
  },
  persist: piniaPersistConfig("prompt")
});
