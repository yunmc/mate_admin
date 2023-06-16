import { ResPage, User } from "@/api/interface/index";
import http from "@/api";

/**
 * @name 用户管理模块
 */
// 获取用户列表
export const getUserList = (params: User.ReqUserParams) => {
  return http.post<ResPage<User.ResUserList>>(`/admin/aiUser/ai_user_list`, params);
};

// 新增用户
export const addUser = (params: { id: string }) => {
  return http.post(`/admin/aiUser/save_ai_user`, params);
};

// 编辑用户
export const editUser = (params: { id: string }) => {
  return http.post(`/admin/aiUser/save_ai_user`, params);
};
