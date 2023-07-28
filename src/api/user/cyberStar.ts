import http from "@/api";
// import { ReqPage } from "@/api/interface/index";

interface getCyberStarListType {
  page: number;
  pageSize: number;
  search?: string;
  is_cele?: number;
}
// 获取网红列表
export const getCyberStarList = (params: getCyberStarListType) => {
  return http.post(`/admin/celebrity/list`, params);
};

interface postCyberStarInfoType {
  user_account: string; // 用户账号
  real_name: string; // 真实姓名
  screen_name: string; // 网名
  coin2diamond: string; // 金币与钻石收益兑换比
  coop_info: string; // 合作信息, 建议使用富文本
  contract_file: string; // 合同文件地址, 上传后会返回
  coop_stm: string; // 合作开始时间, 使用 Y-m-d H:i:s格式
  coop_etm: string; //合作有效时间
}
// 编辑网红信息
export const postCyberStarInfo = (params: { [key: string]: any }) => {
  return http.post(`/admin/celebrity/save_coop`, params);
};

// 获取网红详情信息
export const getCyberStarInfo = (uid: string) => {
  return http.post(`/admin/celebrity/detail`, { uid: uid });
};
