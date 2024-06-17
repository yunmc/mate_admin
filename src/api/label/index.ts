import http from "@/api";

export const getAllTags = () => {
  return http.post(`/admin/tag/all_tags`);
};

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

export const getAllCategories = () => {
  return http.post(`/admin/category/all_category`);
};

interface ICreateCategoryParams {
  category_name: string;
  category_weight: number;
}
export const createCategory = (params: ICreateCategoryParams) => {
  return http.post(`/admin/category/save_category`, params);
};

interface IUpdateCategoryParams {
  id: number;
  category_name: string;
  category_weight: number;
}
export const updateCategory = (params: IUpdateCategoryParams) => {
  return http.post(`/admin/category/update_category`, params);
};

interface IDeleteCategoryParams {
  id: number;
}
export const deleteCategory = (params: IDeleteCategoryParams) => {
  return http.post(`/admin/category/delete_category`, params);
};

interface IGetCategoryParams {
  page: number;
  page_size: number;
}
export const getCategoryList = (params: IGetCategoryParams) => {
  return http.post(`/admin/category/category_list`, params);
};
