import http from "@/api";

interface getAPPType {
  client_type: string; // 客户端类型
  upgrade_content?: string; // 更新信息
  upgrade_version?: string; // 最新版本
  upgrade_type?: number; // 更新类型
}

interface ActivityType {
  id?: number | string;
  activity_target?: number | string;
  activity_channel?: number | string; // 频道页面 id  1：我的页  2：首页
  activity_platform?: number | string; // 跳转类型   1：原生页面  2：h5 页面
  activity_status?: number | string; // 运营位状态   1：上线   2：下线
  page: number | string; // 页码
  page_size: number | string; // 每页数量
}
// 获取app版本更新
export const getUpgradeVersion = () => {
  return http.post(`/admin/system/upgrade_version`);
};

// 添加保存APP版本更新
export const saveUpgradeVersion = (params: getAPPType) => {
  return http.post(`/admin/system/save_upgrade_version`, params);
};

// 设置审核版本
export const setCheckVersion = (params: getAPPType) => {
  return http.post(`/admin/system/set_check_version`, params);
};

// 删除审核版本
export const delCheckVersion = (params: getAPPType) => {
  return http.post(`/admin/system/del_check_version`, params);
};

// 审核版本列表
export const getCheckVersions = () => {
  return http.get(`/admin/system/get_check_versions`);
};

// 运营位列表
export const getActivityList = (params: ActivityType) => {
  return http.post(`/admin/user_activity/list`, params);
};

// 更新运营位
export const getActivityUpdate = (params: any) => {
  return http.post(`/admin/user_activity/update`, params);
};

// 添加运营位
export const getActivitySave = (params: any) => {
  return http.post(`/admin/user_activity/save`, params);
};

// 删除运营位
export const deleteActivity = (params: any) => {
  return http.post(`/admin/user_activity/delete`, params);
};
