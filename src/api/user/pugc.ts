import http from "@/api";
// import { ReqPage } from "@/api/interface/index";

interface PugcType {
  page: number;
  pageSize: number;
  model_id?: string;
  pic_level?: number | string;
}
// UGC快捷创建模版列表
export const getPugcList = (params: PugcType) => {
  return http.post(`/admin/ai_user_model_pic/list`, params);
};

// 获取用户详情信息
export const getPugcPicSave = (params: any) => {
  return http.post(`/admin/ai_user_model_pic/save`, params);
};

// 获取用户详情信息
export const getPugcPicDel = (params: any) => {
  return http.post(`/admin/ai_user_model_pic/del`, params);
};
