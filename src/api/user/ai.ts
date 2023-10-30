import http from "@/api";
// import { ReqPage } from "@/api/interface/index";

interface getUserAiListType {
  page: number;
  pageSize: number;
  uid?: string;
  ai_uid?: string;
  sex?: string;
  state?: string;
  stm?: string;
  etm?: string;
}
// 获取用户ai列表
export const getUserList = (params: getUserAiListType) => {
  return http.post(`/admin/ai_user/get_custom_ai_list`, params);
};

export const getRelationship = () => {
  return http.post(`/admin/ai_user/get_relationship`);
};
