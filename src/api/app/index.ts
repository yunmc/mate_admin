import http from "@/api";

interface getAPPType {
  client_type: string; // 客户端类型
  upgrade_content: string; // 更新信息
  upgrade_version: string; // 最新版本
  upgrade_type: number; // 更新类型
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
export const setCheckVersion = () => {
  return http.post(`/admin/system/set_check_version`);
};

// 删除审核版本
export const delCheckVersion = (params: getAPPType) => {
  return http.post(`/admin/system/del_check_version`, params);
};
