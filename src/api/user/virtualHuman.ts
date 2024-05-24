import http from "@/api";
// import { ReqPage } from "@/api/interface/index";

interface getUserListType {
  page: number;
  pageSize: number;
  name?: string;
  state?: string | number;
  ai_platform?: number;
}
// 获取虚拟人列表
export const getVirtualHumanList = (params: getUserListType) => {
  return http.post(`/admin/aiUser/ai_user_list`, params);
};

// 添加虚拟人
export const addVirtualHuman = (params: { [key: string]: any }) => {
  return http.post(`admin/aiUser/save_ai_user`, params);
};

// 虚拟人下线/上线
export const postOfflineAi = (ai_uid: string) => {
  return http.post(`/admin/aiUser/offline_ai_user`, { ai_uid: ai_uid });
};
