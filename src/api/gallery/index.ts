import http from "@/api";

interface getPicType {
  ai_uid?: string; // AI用户的ID
  ai_name?: string; // AI用户的名字, 不支持模糊查询
  pic_level?: number | string; // 图片等级 1 2 3
  page: number;
  pageSize: number;
  search?: boolean;
  ai_platform?: number;
}
interface savePicType {
  images: Array<string>; // AI用户的ID
  ai_uid: string; // 需要添加的机器人ID
  pic_level?: number; // 图片等级 1 2 3
  ai_platform?: number;
}
export interface fileType {
  ext: string;
  file: string;
}
// 获取AI收费图片列表
export const getPicList = (params: getPicType) => {
  return http.post(`/admin/ai_user_pic/list`, params);
};

// 保存AI收费图片信息
export const savePic = (params: savePicType) => {
  return http.post(`/admin/ai_user_pic/save`, params);
};

// 上传AI收费图片
export const uploadFile = (params: fileType) => {
  return http.post(`/admin/common/upload_file_blur`, params);
};

// 上传AI收费图片
export const delPic = (params: any) => {
  return http.post(`/admin/ai_user_pic/del`, params);
};
