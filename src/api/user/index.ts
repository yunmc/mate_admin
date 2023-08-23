import http from "@/api";
// import { ReqPage } from "@/api/interface/index";

interface getUserListType {
  page: number;
  pageSize: number;
  search?: string;
  coinSearch?: string;
}
// 获取用户列表
export const getUserList = (params: getUserListType) => {
  return http.post(`/admin/user/list`, params);
};

// 获取用户详情信息
export const getStaffUserInfo = (uid: string) => {
  return http.post(`/admin/user/detail`, { uid: uid });
};
