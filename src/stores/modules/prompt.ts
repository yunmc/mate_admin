import { defineStore } from "pinia";
import { PromptState } from "@/stores/interface";
import piniaPersistConfig from "@/config/piniaPersist";

export const usePromptStore = defineStore({
  id: "prompt",
  state: (): PromptState => ({
    info: {}, // ai info
    momentInfo: {}, // moment info
    isSystem: false,
    isUsersay: false,
    isMessage: false
  }),
  getters: {},
  actions: {
    // Set setUserInfo
    setPromptInfo(userInfo: any, momentInfo: any = {}) {
      this.info = userInfo;
      this.momentInfo = momentInfo;
    }
  },
  persist: piniaPersistConfig("prompt")
});
