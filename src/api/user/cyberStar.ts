import http from "@/api";
// import { ReqPage } from "@/api/interface/index";

interface getCyberStarListType {
  page: number;
  pageSize: number;
  search?: string;
}
// 获取网红列表
export const getCyberStarList = (params: getCyberStarListType) => {
  return http.post(`/admin/celebrity/list`, params);
};

interface postCyberStarInfoType {
  page: number;
  pageSize: number;
  search: string;
}
// 编辑网红信息
export const postCyberStarInfo = (params: { [key: string]: any }) => {
  return http.post(`/admin/celebrity/save_coop`, params);
};

// 获取网红详情信息
export const getCyberStarInfo = (uid: string) => {
  return http.post(`/admin/celebrity/detail`, { uid: uid });
};
