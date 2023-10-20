import http from "@/api";
// import { ReqPage } from "@/api/interface/index";

interface getListType {
  page: number;
  pageSize: number;
}

// 后台充值列表
export const getRechargeList = (params: getListType) => {
  return http.post(`/admin/system/get_recharge_log`, params);
};

interface addType {
  amount: number;
  user_account: string;
  recharge_type: number; // 0 金币 1 会员
  remark: string; // 备注
}
// 增加用户金币/会员
export const getStaffUserInfo = (params: addType) => {
  return http.post(`/admin/system/add_recharge`, params);
};
