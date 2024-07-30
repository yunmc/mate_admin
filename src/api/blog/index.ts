import http from "@/api";

interface IGetBlogListParams {
  id?: number;
  ai_platform?: number;
  page?: number;
  pageSize?: number;
}
export const getBlogList = (params: IGetBlogListParams) => {
  return http.post(`/admin/ai_article/list`, params);
};

interface IUpdateBlogParams {
  id: number;
  article_title: string;
  article_content?: string;
  article_weight?: number;
  article_status: number;
  ai_platform: number;
  banner_url?: string;
}
export const updateBlog = (params: IUpdateBlogParams) => {
  return http.post(`/admin/distribution_channel/update`, params);
};

interface ISaveBlogParams {
  article_title: string;
  article_content?: string;
  article_weight?: number;
  article_status?: number;
  ai_platform: number;
  banner_url?: string;
}
export const saveBlog = (params: ISaveBlogParams) => {
  return http.post(`/admin/ai_article/save`, params);
};

interface IDeleteBlogParams {
  id: number;
}
export const deleteBlog = (params: IDeleteBlogParams) => {
  return http.post(`/admin/distribution_channel/delete`, params);
};
