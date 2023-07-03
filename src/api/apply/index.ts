import http from "@/api";
// import { ReqPage } from "@/api/interface/index";

interface getWebListType {
  page: number;
  pageSize: number;
  mark_state: number;
  check_state?: number;
  s_date?: string;
  e_date?: string;
}
interface markWeb {
  id: number;
}
// 官网申请列表
export const getWebList = (params: getWebListType) => {
  return http.post(`/admin/apply/web_list`, params);
};

// 修改官网申请标记
export const markWebApply = (params: markWeb) => {
  return http.post(`/admin/apply/mark_web_apply`, params);
};

// APP申请列表
export const getAppList = (params: getWebListType) => {
  return http.post(`/admin/apply/app_list`, params);
};

// APP标记
export const markAppApply = (params: markWeb) => {
  return http.post(`/admin/apply/mark_app_apply`, params);
};

// 通过
export const passApply = (params: markWeb) => {
  return http.post(`/admin/apply/pass_apply`, params);
};
// 不通过
export const rejectApply = (params: markWeb) => {
  return http.post(`/admin/apply/reject_apply`, params);
};
