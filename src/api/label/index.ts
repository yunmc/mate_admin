import http from "@/api";

interface IGetTagListType {
  page: number;
  page_size: number;
  tag_level: number;
}
/**
 * 获取标签列表
 * @param params
 * @returns
 */
export const getTagList = (params: IGetTagListType) => {
  return http.post(`/admin/tag/tag_list`, params);
};

interface IUpdateTagType {
  id: number;
  tag_name: string;
  tag_weight: number;
  tag_level: number;
  parent_tag_id?: number;
}
export const updateTag = (params: IUpdateTagType) => {
  return http.post(`/admin/tag/update_tag`, params);
};

interface ISaveTagType {
  tag_name: string;
  tag_weight: number;
  tag_level: number;
  parent_tag_id?: number;
}
export const saveTag = (params: ISaveTagType) => {
  return http.post(`/admin/tag/save_tag`, params);
};

interface IDeleteTagType {
  id: number;
}
export const deleteTag = (params: IDeleteTagType) => {
  return http.post(`/admin/tag/delete_tag`, params);
};
